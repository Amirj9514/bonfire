import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  sharedData = new BehaviorSubject({});

  constructor(private httpClient: HttpClient) {}

  /** to get data this.sharedService.getData().subscribe((data: any) => {}) **/
  public getData() {
    let storedData = localStorage.getItem('sharedData@HFC');
    this.sharedData.next(JSON.parse(storedData || '{}'));
    return this.sharedData.asObservable();
  }

  /** to insert data this.sharedService.insertData({ key: 'name', val: response.data }) **/
  public insertData(data: any) {
    this.sharedData.next({
      ...this.sharedData.getValue(),
      [data.key]: data.val,
    });
    localStorage.setItem(
      'sharedData@HFC',
      JSON.stringify(this.sharedData.value)
    );
  }

  /** Get Request **/
  public sendGetRequest(target: string, token: any): Observable<any[]> {
    var headers_object = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this.httpClient.get<any[]>(environment.apiUrl + target, httpOptions);
  }

  /** Get Request **/
  public sendGetRequest2(target: string): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiUrl + target);
  }
  /** Post Request **/
  public sendPostRequest(
    target: string,
    data: any,
    token: any
  ): Observable<any[]> {
    var headers_object = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this.httpClient.post<any[]>(
      environment.apiUrl + target,
      data,
      httpOptions
    );
  }

  /** Put Request **/
  public sendPutRequest(
    target: string,
    data: any,
    token: any
  ): Observable<any[]> {
    var headers_object = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this.httpClient.put<any[]>(
      environment.apiUrl + target,
      data,
      httpOptions
    );
  }

  /** Patch Request **/
  public sendPatchRequest(
    target: string,
    data: any,
    token: any
  ): Observable<any[]> {
    var headers_object = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this.httpClient.patch<any[]>(
      environment.apiUrl + target,
      data,
      httpOptions
    );
  }

  /** Delete Request **/
  public sendDeleteRequest(target: string, token: any): Observable<any[]> {
    var headers_object = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this.httpClient.delete<any[]>(
      environment.apiUrl + target,
      httpOptions
    );
  }
}
