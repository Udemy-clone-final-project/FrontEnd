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
  private baseUrl = 'https://localhost:7106/api';

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
      page,
      pageSize: limit,
    };
    if (params?.q) httpParams.searchItem = params.q;
    if (params?.sort === 'price') {
      httpParams.sortColomn = 'price';
      httpParams.sortOrder = params?.order ?? 'asc';
    }
    // Optionally map tag to category if numeric
    if (params?.tag && /^\d+$/.test(params.tag)) httpParams.Category = Number(params.tag);

    return this.http
      .get<PagedResponse<ProductVariantDto>>(`${this.baseUrl}/ProductVariant`, { params: httpParams })
      .pipe(
        map((res) => {
          const items = (res.items ?? res.Items ?? []).map(this.mapVariantToProduct);
          const total = (res.total ?? res.totalCount ?? res.TotalCount ?? 0) as number;
          return { items, total };
        })
      );
  }

  private mapVariantToProduct(variant: ProductVariantDto): ProductDto {
    return {
      id: variant.id,
      slug: `${variant.id}`,
      title: `${variant.designTitle} - ${variant.baseProductName}`,
      description: '',
      price: variant.price,
      currency: 'USD',
      images: (variant.images || []).map(i => i.imageUrl || '').filter(Boolean),
      style: variant.baseProductName,
      colors: [{ code: variant.colorCode, name: variant.colorName }].filter(c => !!c.code && !!c.name) as any,
      sizes: [variant.sizeName].filter(Boolean) as string[],
      tags: [],
      artist: { id: 0, name: variant.designTitle },
      printLocation: []
    };
  }

  getTags(): Observable<{ id: number; name: string; slug: string }[]> {
    return this.http.get<{ id: number; name: string; slug: string }[]>(`${this.baseUrl}/tags`);
  }

  getById(id: number): Observable<ProductDto> {
    return this.http.get<ProductVariantDto>(`${this.baseUrl}/ProductVariant/${id}`).pipe(map(this.mapVariantToProduct));
  }

  getBySlug(slug: string): Observable<ProductDto | null> {
    const id = Number(slug);
    if (Number.isNaN(id)) return of(null);
    return this.getById(id).pipe(map(p => p || null));
  }

  getRelatedProducts(productId: number): Observable<ProductDto[]> {
    // Placeholder: backend doesn't expose related endpoint yet
    return of([]);
  }

  getSizeGuides(): Observable<SizeGuidesDto> {
    return of({
      men: { units: { in: { sizes: [], chest: [], length: [] }, cm: { sizes: [], chest: [], length: [] } } },
      women: { units: { in: { sizes: [], chest: [], length: [] }, cm: { sizes: [], chest: [], length: [] } } }
    } as SizeGuidesDto);
  }
}

// Backend contracts used for mapping
export interface ProductVariantDto {
  id: number;
  price: number;
  isActive: boolean;
  baseProductId: number;
  baseProductName: string;
  baseProductPrice: number;
  designId: number;
  designTitle: string;
  designPrice: number;
  colorId: number;
  colorName: string;
  colorCode: string;
  sizeId: number;
  sizeName: string;
  images: { id: number; imageUrl?: string; fileName?: string; altText?: string; isPrimary: boolean; isActive: boolean }[];
}

export interface PagedResponse<T> {
  items?: T[];
  Items?: T[];
  total?: number;
  totalCount?: number;
  TotalCount?: number;
  page?: number;
  pageSize?: number;
}
