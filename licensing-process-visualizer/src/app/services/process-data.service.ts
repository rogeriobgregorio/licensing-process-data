import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  constructor(private http: HttpClient) {}

  getProcesses(filename: string): Observable<any> {
    return this.http.get<any>(`${filename}`);
  }
}
