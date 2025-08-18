import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { ProductService, ProductDto, PrintLocationDto } from '../../Services/product.service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private prdService = inject(ProductService);
  private cart = inject(CartService);


  product = toSignal<ProductDto | null>(
    this.route.queryParamMap.pipe(
      map(p=> Number(p.get('id') ?? '2527')),
      switchMap(id=> this.prdService.getById(id))
    ),
    {initialValue: null}
  );

  // UI state
  selectedColorIndex = signal<number>(0);
  selectedSize = signal<string | null>(null);
  selectedPrintLocation = signal<PrintLocationDto | null>(null);
  quantity = signal<number>(1);

  price = computed(() => this.product()?.price ?? 0);
  currency = computed(() => this.product()?.currency ?? 'USD');
  canAddToCart = computed(() => this.selectedSize() !== null && !!this.product());

  related = signal<ProductDto[]>([]);

  constructor() {
    // Reset selections whenever product changes
    effect(() => {
      const p = this.product();
      if (!p) return;
      this.selectedColorIndex.set(p.selectedColorIndex ?? 0);
      this.selectedSize.set(p.sizes?.[0] ?? null);
      this.selectedPrintLocation.set(p.printLocation?.[0] ?? null);
      this.quantity.set(1);
      this.prdService.getRelatedProducts(p.id).subscribe(list => this.related.set(list));
    });
  }

  selectColor(index: number) { this.selectedColorIndex.set(index); }
  selectSize(size: string) { this.selectedSize.set(size); }
  incQty() { this.quantity.set(this.quantity() + 1); }
  decQty() { this.quantity.set(Math.max(1, this.quantity() - 1)); }
  selectPrintLocation(printLocation: PrintLocationDto) { this.selectedPrintLocation.set(printLocation); }
  addToCart() {
    const p = this.product();
    if (!p || !this.canAddToCart()) return;
    this.cart.add({
      productId: p.id,
      variant: {
        color: p.colors[this.selectedColorIndex()]?.code ?? '',
        size: this.selectedSize() ?? ''
      },
      qty: this.quantity()
    });
  }
}
