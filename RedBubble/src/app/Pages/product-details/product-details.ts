import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  ProductService,
  ProductDto,
  PrintLocationDto,
} from '../../Services/product.service';
import { CurrencyPipe } from '@angular/common';
import { CartService, CartItem } from '../../Services/cart.service';
import { ProductCard } from '../../Components/product-card/product-card';
import { MoreProductsSection } from '../../Components/more-products-section/more-products-section';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterModule,
    MoreProductsSection,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private prdService = inject(ProductService);
  public cart = inject(CartService);

  product = toSignal<ProductDto | null>(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id') ?? '0');
        if (!id) throw new Error('Invalid product id');
        return this.prdService.getById(id).pipe(
          catchError(() => {
            this.router.navigate(['/not-found']);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );
  selectedColorIndex = signal<number>(0);
  selectedSize = signal<string | null>(null);
  // selectedPrintLocation = signal<PrintLocationDto | null>(null);
  quantity = signal<number>(1);
  cartUpdated = signal<boolean>(false);
  price = computed(() => this.product()?.price ?? 0);
  currency = computed(() => this.product()?.currency ?? 'USD');
  canAddToCart = computed(
    () =>
      this.product() !== null &&
      this.selectedSize() !== null &&
      this.selectedColorIndex() >= 0 &&
      this.quantity() > 0
  );
  related = signal<ProductDto[]>([]);
  showError = computed(
    () =>
      !this.canAddToCart() &&
      (this.selectedColorIndex() < 0 || this.selectedSize() === null)
  );

  constructor() {
    // Reset selections whenever product changes
    effect(() => {
      const p = this.product();
      if (!p) return;
      this.selectedColorIndex.set(p.selectedColorIndex ?? 0);
      this.selectedSize.set(p.sizes?.[0] ?? null);
      // this.selectedPrintLocation.set(p.printLocation?.[0] ?? null);
      this.quantity.set(1);
      this.prdService
        .getRelatedProducts(p.id)
        .subscribe((list) => this.related.set(list));
    });

    effect(()=>{
      if(this.cartUpdated()){
        const offCanvasElement = document.querySelector('#cartSideBar');
        if(offCanvasElement){

          const offCanvas = new (window as any).bootstrap.Offcanvas(offCanvasElement);
          offCanvas.show();
          this.cartUpdated.set(false);
        }
      }
    });


  }

  selectColor(index: number) {
    this.selectedColorIndex.set(index);
  }
  selectSize(size: string) {
    this.selectedSize.set(size);
  }
  incQty() {
    this.quantity.set(this.quantity() + 1);
  }

  decQty() {
    this.quantity.set(Math.max(1, this.quantity() - 1));
  }

  // selectPrintLocation(printLocation: PrintLocationDto) { this.selectedPrintLocation.set(printLocation); }
  addToCart() {
    const p = this.product();
    if (!p || !this.canAddToCart()) return;
    this.cart.add({
      images: p.images,
      title: p.title ?? '',
      price: p.price ?? 0,
      productId: p.id,
      currency: p.currency ?? 'USD',
      variant: {
        color: p.colors[this.selectedColorIndex()]?.code ?? '',
        size: this.selectedSize() ?? '',
      },
      qty: this.quantity(),
    });

    this.cartUpdated.set(true);
  }

  updateQuantity(item: CartItem, change: number) {
    if (item.qty + change <= 0) {
      this.removeFromCart(item);
      return;
    }

    // Since CartService doesn't have a direct update method for quantity,
    // we'll remove and re-add with the new quantity
    this.cart.remove({
      productId: item.productId,
      variant: item.variant
    });

    this.cart.add({
      productId: item.productId,
      images: item.images,
      title: item.title,
      price: item.price,
      currency: item.currency,
      variant: item.variant,
      qty: item.qty + change
    });
  }

  removeFromCart(item: CartItem) {
    this.cart.remove({
      productId: item.productId,
      variant: item.variant
    });
  }
}
