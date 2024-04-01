import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  constructor(private http: HttpClient) { 
  }

  getDays(): Observable<any> {
    const url = 'http://localhost:3030/data';
    return this.http.get<any>(url);
  }

  updateData(data): void {
    const url = 'http://localhost:3030/update';
    console.log("updated the data");
    this.http.post<any>(url, data).subscribe();
  }

  updateChoices(count, setDay, day, exercise): void{
    const url = 'http://localhost:3030/updateChoices';
    const data = {
      "count": count,
      "setDay": setDay,
      "day": day,
      "exercise": exercise
    }
    console.log("updated the choices");
    this.http.post<any>(url, data).subscribe();
  }

  getChoices(): Observable<any> {
    const url = 'http://localhost:3030/getChoices';
    return this.http.get<any>(url);
  }

}
