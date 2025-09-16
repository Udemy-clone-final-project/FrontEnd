import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductCard } from '../../Components/product-card/product-card';
import { ProductDto, ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCard],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class Shop {
  private productService = inject(ProductService);
  public route = inject(ActivatedRoute);

  // UI state
  products = signal<ProductDto[]>([]);
  total = signal<number>(0);
  isLoading = signal<boolean>(false);
  // basic filters for MVP
  query = signal<string>('');
  sort = signal<string>('relevance');
  page = signal<number>(1);
  pageSize = signal<number>(12);
  totalPages = signal<number>(1);

  constructor() {
    effect(() => {
      // react to dependencies + route param (tag)
      const slug = this.route.snapshot.paramMap.get('slug') ?? undefined;
      const _ = [this.query(), this.sort(), this.page(), this.pageSize(), slug];
      this.fetchProducts();
    });
  }

  fetchProducts() {
    this.isLoading.set(true);
    const tag = this.route.snapshot.paramMap.get('slug') ?? undefined;
    this.productService
      .getAll({
        page: this.page(),
        limit: this.pageSize(),
        q: this.query() || undefined,
        tag,
        sort: this.sort() === 'price' ? 'price' : undefined,
        order: this.sort() === 'price' ? 'asc' : undefined
      })
      .subscribe(({ items, total }) => {
        this.products.set(items);
        this.total.set(total);
        this.totalPages.set(Math.max(1, Math.ceil(total / this.pageSize())));
        this.isLoading.set(false);
      });
  }

  onSearch(term: string) {
    this.page.set(1);
    this.query.set(term);
  }

  changeSort(value: string) {
    this.page.set(1);
    this.sort.set(value);
  }

  nextPage() {
    if (this.page() < this.totalPages()) this.page.set(this.page() + 1);
  }

  prevPage() {
    if (this.page() > 1) this.page.set(this.page() - 1);
  }
}


