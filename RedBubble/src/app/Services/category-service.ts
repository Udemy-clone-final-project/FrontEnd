import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../Models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  //#region with API

  // private apiUrl = '/api/categories';
  // constructor(private http: HttpClient) {}

  // getCategories() {
  //   return this.http.get<Category[]>(`${this.apiUrl}`);
  // }

  // getCategoryBySlug(id: string) {
  //   return this.http.get<Category>(`${this.apiUrl}/${id}`);
  // }

  //#endregion

  //#region with Fake API

  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
  // #endregion

  // getSubCategoriesByCategory()
  // getThemesByCategory
}
