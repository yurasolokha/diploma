import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Guid } from '../types/guid';
import { ApiResponseType } from '../api/api-reponse-type.enum';

@Injectable()
export abstract class AbstractRestService {
  private api: string = environment.api_url;

  protected constructor(protected http: HttpClient) { }

  protected get<T>(path: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.api}/${path}`, { params })
    .pipe(
      map((res) => this.handleResponse(res)),
      catchError((err) => { throw this.handleError(err); })
    );
  }

  protected delete<T>(path: string, id: Guid): Observable<T> {
    return this.http.delete<T>(`${this.api}/${path}/${id}`)
    .pipe(
      map((res) => this.handleResponse(res)),
      catchError((err) => { throw this.handleError(err); })
    );
  }

  protected postItem<T, TK>(path: string,entity?: T): Observable<TK> {
    return this.http.post<TK>(`${this.api}/${path}`, entity)
    .pipe(
      map((res) => this.handleResponse(res)),
      catchError((err) => { throw this.handleError(err); })
    );
  }

  protected putItem<T, TK>(path: string,entity: T): Observable<TK> {
    return this.http.put<TK>(`${this.api}/${path}`, entity)
    .pipe(
      map((res) => this.handleResponse(res)),
      catchError((err) => { throw this.handleError(err); })
    );
  }

  private handleError(error: any) : any {
    return error;
  }

  private handleResponse(response: any) : any{
    if(!response.responseType) throw response;

    switch(response.responseType)
    {
      case ApiResponseType.Error : throw response;
      case ApiResponseType.Status : return response;
      case ApiResponseType.Content : return response.content;
      case ApiResponseType.BaseApi : return response;

      default: throw response;
    }
  }
}