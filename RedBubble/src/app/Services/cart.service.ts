import { Injectable, signal, effect } from '@angular/core';
import { ProductDto } from './product.service';

export interface CartItem {
  productId: number;
  images: string[];
  title: string;
  price: number;
  currency: string;
  variant: {color: string, size: string};
  qty: number;
}

@Injectable({providedIn: 'root'})

export class CartService{
  private _items = signal<CartItem[]>([]);
private _totalItem = signal(0);
  items = this._items.asReadonly();

  add(item:{productId: number,images: string[],title: string, price:number, currency: string, variant: {color: string, size: string}, qty: number}){

    const product = this.items().find(i=>i.productId === item.productId) || { productId: item.productId, title: 'Unknown', price: 0, currency: 'USD', images: [], style: '', colors: [], sizes: [], tags: [], artist: { id: 0, name: '' } };
    const existing = this.items().find(i=>i.productId === item.productId && i.variant.color === item.variant.color && i.variant.size === item.variant.size);
    if(existing){
      this._items.update(items=>items.map(i=>i.productId === item.productId ? {...i, qty: i.qty + item.qty} : i));
      this._totalItem.set(this._totalItem() + item.qty);
    }
    else{
      // Ensure the 'product' object matches the ProductDto type to avoid type errors
      this._items.update(items => [
        ...items,
        {
          productId: item.productId,
          images: item.images,
          title: item.title,
          price: item.price,
          currency: item.currency,
          variant: item.variant,
          qty: item.qty
        }
      ]);
    }
  }

  clear(){
    this._items.set([]);
  }

  remove(item:{productId: number, variant: {color: string, size: string}}){
    this._items.update(items=>items.filter(i=>i.productId !== item.productId || i.variant.color !== item.variant.color || i.variant.size !== item.variant.size));
  }

  getTotalItem(){
    return this._totalItem();
  }

  getTotalPrice(){
    return this.items().reduce((sum, item)=>sum + item.price * item.qty, 0);
  }


}
