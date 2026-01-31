import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  private api = 'http://localhost:5000/api/expenses';

  constructor(private http: HttpClient) {}

  // ✅ CREATE
  addExpense(data: any) {
    return this.http.post(this.api, data);
  }

  // ✅ READ ALL
  getExpenses() {
    return this.http.get<any[]>(this.api);
  }

  // ✅ READ ONE
  getExpenseById(id: string) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // ✅ UPDATE
  updateExpense(id: string, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  // ✅ DELETE
  deleteExpense(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }

  // ✅ STATS
  getStats() {
    return this.http.get<any>(`${this.api}/stats`);
  }

 importExpenses(data: any[]) {
  return this.http.post(`${this.api}/import`, data);
}



}
