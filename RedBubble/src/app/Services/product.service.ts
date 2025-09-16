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

export interface SizeGuideUnitDto {
  sizes: string[];
  chest: number[];
  length: number[];
}

export interface SizeGuideGenderDto {
  units: { in: SizeGuideUnitDto; cm: SizeGuideUnitDto };
}

export interface SizeGuidesDto {
  men: SizeGuideGenderDto;
  women: SizeGuideGenderDto;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3001';

  getAll(params?: {
    page?: number;
    limit?: number;
    q?: string;
    sort?: 'price';
    order?: 'asc' | 'desc';
    tag?: string;
  }): Observable<{ items: ProductDto[]; total: number }> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 12;
    const httpParams: any = {
      _page: page,
      _limit: limit,
    };
    if (params?.q) httpParams.q = params.q;
    if (params?.sort) {
      httpParams._sort = params.sort;
      httpParams._order = params.order ?? 'asc';
    }
    if (params?.tag) httpParams.tags_like = params.tag;

    return this.http
      .get<ProductDto[]>(`${this.baseUrl}/products`, {
        params: httpParams,
        observe: 'response'
      })
      .pipe(
        map((res) => {
          const total = Number(res.headers.get('X-Total-Count') ?? '0');
          return { items: res.body ?? [], total };
        })
      );
  }

  getTags(): Observable<{ id: number; name: string; slug: string }[]> {
    return this.http.get<{ id: number; name: string; slug: string }[]>(`${this.baseUrl}/tags`);
  }

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

  getSizeGuides(): Observable<SizeGuidesDto> {
    return this.http.get<SizeGuidesDto>(`${this.baseUrl}/sizeGuides`);
  }
}
