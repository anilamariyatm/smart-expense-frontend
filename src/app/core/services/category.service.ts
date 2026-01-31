import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private baseUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(this.baseUrl);
  }

  addCategory(name: string) {
    return this.http.post(this.baseUrl, { name });
  }
}
