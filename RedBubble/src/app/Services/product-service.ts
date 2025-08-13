import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../Models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/subCategories'; // replace with your real API

  constructor(private http : HttpClient){}

  getProductsBySubCategory(subCatId:string) : Observable<Product[]>{

    const url = `${this.apiUrl}?subCategoryId=${subCatId}`
    // https://your-backend-api.com/api/products?subCategoryId=15
    //  Breaking it down:
    // this.apiUrl → base API endpoint, e.g. "https://your-backend-api.com/api/products".
    // ?subCategoryId= → query string parameter that tells the API you’re filtering by subcategory.
    // ${subCatId} → placeholder that will be replaced with the actual value passed to the function.

    return this.http.get<Product[]>(url);

  }

  getProductsByTheme(themeId:string) : Observable<Product[]>{
    const url = `${this.apiUrl}?themeId=${themeId}`;
    return this.http.get<Product[]>(url);
  }

}

