import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.example.com/v1'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
  }

  private getAuthToken(): string {
    // Get token from localStorage or your preferred storage
    return localStorage.getItem('authToken') || '';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => error);
  }

  // Generic HTTP methods
  get<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Specific API methods
  getUsers(): Observable<ApiResponse<any[]>> {
    return this.get<any[]>('users');
  }

  getUser(id: number): Observable<ApiResponse<any>> {
    return this.get<any>(`users/${id}`);
  }

  createUser(userData: any): Observable<ApiResponse<any>> {
    return this.post<any>('users', userData);
  }

  updateUser(id: number, userData: any): Observable<ApiResponse<any>> {
    return this.put<any>(`users/${id}`, userData);
  }

  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.delete<any>(`users/${id}`);
  }

  // Authentication methods
  login(credentials: { email: string; password: string }): Observable<ApiResponse<any>> {
    return this.post<any>('auth/login', credentials);
  }

  logout(): Observable<ApiResponse<any>> {
    return this.post<any>('auth/logout', {});
  }

  refreshToken(): Observable<ApiResponse<any>> {
    return this.post<any>('auth/refresh', {});
  }

  // Data synchronization methods
  syncUserData(userData: any): Observable<ApiResponse<any>> {
    return this.post<any>('sync/users', userData);
  }

  syncSettings(settings: any): Observable<ApiResponse<any>> {
    return this.post<any>('sync/settings', settings);
  }

  // File upload method
  uploadFile(file: File, endpoint: string): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${endpoint}`, formData, {
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Health check
  healthCheck(): Observable<ApiResponse<any>> {
    return this.get<any>('health');
  }
}