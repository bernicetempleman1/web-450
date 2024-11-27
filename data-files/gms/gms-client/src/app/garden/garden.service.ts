import { Garden } from './garden';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UpdateGardenDTO } from './garden';
import { AddGardenDTO } from './garden';

@Injectable({
  providedIn: 'root',
})
export class GardenService {
  constructor(private http: HttpClient) {}
  getGardens() {
    return this.http.get<Garden[]>(`${environment.apiBaseUrl}/api/gardens`);
  }
  getGarden(gardenId: number) {
    return this.http.get<Garden>(
      `${environment.apiBaseUrl}/api/gardens/${gardenId}`
    );
  }
  addGarden(garden: AddGardenDTO) {
    return this.http.post<Garden>(
      `${environment.apiBaseUrl}/api/gardens`,
      garden
    );
  }
  updateGarden(garden: UpdateGardenDTO, gardenId: number) {
    return this.http.patch<Garden>(
      `${environment.apiBaseUrl}/api/gardens/${gardenId}`,
      garden
    );
  }
  deleteGarden(gardenId: number) {
    return this.http.delete(
      `${environment.apiBaseUrl}/api/gardens/${gardenId}`
    );
  }
}
