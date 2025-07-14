import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export interface CoinModel {
  coin: string;
  date: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CoinsService {
  private baseUrl = 'https://localhost:7205/api/coins'; // ודאי שזה מתאים לשרת שלך

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    return throwError(() => new Error(error.message || 'שגיאה לא צפויה'));
  }

  getWeek(coin: string): Observable<CoinModel[]> {
    return this.http.get<CoinModel[]>(`${this.baseUrl}/week/${coin}`).pipe(
      catchError(this.handleError)
    );
  }

  getMonth(coin: string): Observable<CoinModel[]> {
    return this.http.get<CoinModel[]>(`${this.baseUrl}/month/${coin}`).pipe(
      catchError(this.handleError)
    );
  }

  getHalfYear(coin: string): Observable<CoinModel[]> {
    return this.http.get<CoinModel[]>(`${this.baseUrl}/halfyear/${coin}`).pipe(
      catchError(this.handleError)
    );
  }

  getYear(coin: string): Observable<CoinModel[]> {
    return this.http.get<CoinModel[]>(`${this.baseUrl}/year/${coin}`).pipe(
      catchError(this.handleError)
    );
  }
}
