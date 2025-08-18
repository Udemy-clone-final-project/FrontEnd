import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, forkJoin, of, switchMap } from 'rxjs';

export interface ProductDto {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  style: string;
  colors: { code: string; name: string; isLight?: boolean }[];
  sizes: string[];
  tags: string[];
  artist: { id: number; name: string };
  selectedColorIndex?: number;
  printLocation: PrintLocationDto[];
}

export interface PrintLocationDto {
  id: number;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3001';

  getById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/products/${id}`);
  }

  getBySlug(slug: string): Observable<ProductDto | null> {
    return this.http
      .get<ProductDto[]>(`${this.baseUrl}/products/`, { params: { slug } })
      .pipe(map((arr) => arr[0] ?? null));
  }

  getRelatedProducts(productId: number): Observable<ProductDto[]> {
    // JSON Server: /related?productId=ID returns [{ productId, relatedId }]
    return this.http
      .get<{ productId: number; relatedId: number }[]>(`${this.baseUrl}/related`, {
        params: { productId }
      })
      .pipe(
        map(rels => rels.map(r => r.relatedId)),
        // Fan-out to fetch each related product. In real API, backend should return products directly.
        switchMap((ids) =>
          ids.length
            ? forkJoin(ids.map((id) => this.http.get<ProductDto>(`${this.baseUrl}/products/${id}`)))
            : of([] as ProductDto[])
        )
      );
  }
}
