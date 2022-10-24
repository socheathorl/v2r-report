import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, ReplaySubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(
    private http: HttpClient,
  ){}
  allowImageMimeType: string[] = [
    "text/csv", "text/plain", "application/json"
  ];

  uploadFile(file: File): Observable<any> {
    let names = file.name.split('.');
    names.pop();
    let fileName = names.join('_');
    let fileSize = file.size;
    return this.getBase64(file).pipe(map(base64 => {
      return this.http.post('https://dm89jr0mw4.execute-api.ap-southeast-1.amazonaws.com/dev/data',
        {
          fileName: fileName.replace(/ /g, ''),
          contentType: file.type,
          fileSize: fileSize,
          content: base64,
        }).pipe(map(result => {
        return result;
      }),catchError(err => {
        return throwError(err);
      }));
    }));
    
  }

  getBase64(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    // reader.readAsBinaryString(file);
    reader.addEventListener('load',() => result.next(btoa(reader.result!.toString())));
    reader.readAsBinaryString(file);
    // reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }
}
