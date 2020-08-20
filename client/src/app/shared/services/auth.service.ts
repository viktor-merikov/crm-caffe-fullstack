import { Injectable } from '@angular/core';
import { User } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})

export class AuthService {

   private token = null;

   constructor(private http: HttpClient) { }

   register(user: User): Observable<User> {
      return this.http.post<User>('/api/auth/register', user);
   }

   login(user: User): Observable<{ token: string }> {
      return this.http.post<{ token: string }>('/api/auth/login', user)
         .pipe(
            tap(
               ({ token }) => {
                  localStorage.setItem('authToken', token);
                  this.setToken(token);
               }
            )
         );
   }

   setToken(token: string) {
      this.token = token;
   }

   getToken() {
      return this.token;
   }

   isAuthenticated(): boolean {
      return !!this.token;
   }

   logout() {
      this.setToken(null);
      localStorage.clear();
   }
}