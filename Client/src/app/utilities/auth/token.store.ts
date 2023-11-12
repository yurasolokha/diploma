import { Injectable } from '@angular/core';
import { TokenPayload } from './token.payload';

@Injectable({ providedIn: 'root' })
export class TokenStoreService  {
  private token: string | null;
  private ACCESS_TOKEN = 'accessToken';

  constructor() {
    this.token = localStorage.getItem(this.ACCESS_TOKEN);
  }

  isTokenExpired(): boolean {
    if (!this.token) return true;

    const date = this.getTokenExpirationDate();
    return date.valueOf() <= new Date().valueOf();
  }

  private getTokenExpirationDate(): Date {
    const payload = this.getTokenPayload();
    return payload.getExpirationDate();
  }

  private getTokenPayload(): TokenPayload {
    const encodedTokenPayload = this.token!.split('.')[1];
    const decodedTokenPayload = atob(encodedTokenPayload);
    const tokenPayload = new TokenPayload(JSON.parse(decodedTokenPayload));
    return tokenPayload;
  }

  getUsername(): string | null {
    if (this.isTokenExpired()) return null;

    const tokenPayload = this.getTokenPayload();
    return tokenPayload.getUsername();
  }

  getUserId(): string | null {
    if (this.isTokenExpired()) return null;

    const tokenPayload = this.getTokenPayload();
    return tokenPayload.getUserId();
  }

  getEmail(): string | null {
    if (this.isTokenExpired()) return null;

    const tokenPayload = this.getTokenPayload();
    return tokenPayload.getEmail();
  }

  getRole(): string | null {
    if (this.isTokenExpired()) return null;

    const tokenPayload = this.getTokenPayload();
    return tokenPayload.getRole();
  }

  getToken(): string | null {
    return this.token;
  }

  removeToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    this.token = null;
  }

  setToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, token);
    this.token = token;
  }
}
