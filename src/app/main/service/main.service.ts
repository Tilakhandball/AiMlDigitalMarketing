import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })

export class MainService {

  constructor(private http: HttpClient) { }

  trainDataSet = (dataFile: File) => {
    console.log(dataFile);
    const trainPostData = new FormData();
    trainPostData.append('trainXls', dataFile);
    return this.http.post<any>(BACKEND_URL + 'train', trainPostData);
  }

  marketingChannelSubmit = (formData: FormGroup) => {
    return this.http.post<any>(BACKEND_URL + 'form', formData);
  }
}
