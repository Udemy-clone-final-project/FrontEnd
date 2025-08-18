import { Injectable, signal, effect } from '@angular/core';

export interface CartItem {
  productId: number;
  variant: { color: string; size: string };
  qty: number;
}

const STORAGE_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>(this.read());
  totalCount = signal(0);

  constructor() {
    effect(() => {
      const data = JSON.stringify(this.items());
      localStorage.setItem(STORAGE_KEY, data);
      this.totalCount.set(this.items().reduce((sum, i) => sum + i.qty, 0));
    });
  }

  add(item: CartItem) {
    const list = [...this.items()];
    const ix = list.findIndex(
      i => i.productId === item.productId &&
           i.variant.color === item.variant.color &&
           i.variant.size === item.variant.size
    );
    if (ix >= 0) list[ix] = { ...list[ix], qty: list[ix].qty + item.qty };
    else list.push(item);
    this.items.set(list);
  }

  private read(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}


