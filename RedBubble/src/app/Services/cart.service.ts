import { Injectable, signal, effect, computed } from '@angular/core';
import { ProductDto } from './product.service';

export interface CartItem {
  productId: number;
  images: string[];
  title: string;
  price: number;
  currency: string;
  variant: { color: string; size: string };
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  private _shippingPrices: Record<'standard' | 'express', number> = {
    standard: 0,
    express: 44.05,
  };
  totalItems = computed(() => this._items().reduce((sum, i) => sum + i.qty, 0));
  subtotal = computed(() =>
    this._items().reduce((sum, i) => sum + i.price * i.qty, 0)
  );

  items = this._items.asReadonly();

  shippingType = signal<'standard' | 'express'>(
    (localStorage.getItem('cart.shippingType') as 'standard' | 'express') ??
      'standard'
  );
  shippingCost = computed(() => this._shippingPrices[this.shippingType()]);
  totalWithShipping = computed(() => this.subtotal() + this.shippingCost());

  setShippingType(type: 'standard' | 'express') {
    this.shippingType.set(type);
  }

  constructor() {
    // Hydrate from localStorage
    try {
      const raw = localStorage.getItem('cart.items');
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          this._items.set(parsed);
        }
      }
    } catch {
      // ignore hydration errors
    }

    // Persist on change
    effect(() => {
      try {
        const current = this._items();
        localStorage.setItem('cart.items', JSON.stringify(current));
      } catch {
        // ignore persistence errors
      }
    });

    // persist shipping type
    effect(() =>
      localStorage.setItem(
        'cart.shippingType',
        JSON.stringify(this.shippingType())
      )
    );
  }

  private isSameLine(
    item1: CartItem,
    item2: { productId: number; variant: { color: string; size: string } }
  ) {
    return (
      item1.productId === item2.productId &&
      item1.variant.color === item2.variant.color &&
      item1.variant.size === item2.variant.size
    );
  }

  changeQuantity(
    line: { productId: number; variant: { color: string; size: string } },
    delta: number
  ) {
    this._items.update((items) => {
      return items
        .map((i) =>
          this.isSameLine(i, line) ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0);
    });
  }

  add(item: CartItem) {
    const existing = this.items().find((i) => this.isSameLine(i, item));

    if (existing) {
      this.changeQuantity(item, item.qty);
    } else {
      // Ensure the 'item' object matches the CartItem type to avoid type errors
      this._items.update((items) => [
        ...items,
        {
          ...item,
        },
      ]);
    }
  }

  clear() {
    this._items.set([]);
  }

  remove(item: {
    productId: number;
    variant: { color: string; size: string };
  }) {
    this._items.update((items) =>
      items.filter(
        (i) =>
          i.productId !== item.productId ||
          i.variant.color !== item.variant.color ||
          i.variant.size !== item.variant.size
      )
    );
  }

  getTotalItem() {
    return this.totalItems();
  }

  getTotalPrice() {
    return this.subtotal();
  }
}
