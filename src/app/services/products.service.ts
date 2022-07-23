import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly url: string = 'http://localhost:9000'

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/products`)
  }

  getProductsError(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/productserr`)
  }

  getProductsDelay(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/productsdelay`)
  }

  getProductsIds(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/products_id`)
  }

  getProductsName(id: string): Observable<string>{
    return this.http.get(`${this.url}/products/name/${id}`, { responseType: 'text' })
  }

  saveProduct(p: Product): Observable<Product>{
    return this.http.post<Product>(`${this.url}/products`, p)
  }

  deleteProduct(p: Product): Observable<any>{
    return this.http.delete<any>(`${this.url}/products/${p._id}`)
  }

  updateProduct(p: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/products/${p._id}`, p)
  }
}
