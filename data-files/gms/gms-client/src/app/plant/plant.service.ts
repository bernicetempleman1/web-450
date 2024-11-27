import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Plant } from './plant';
import { AddPlantDTO } from './plant';
import { UpdatePlantDTO } from './plant';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  constructor(private http: HttpClient) {}
  getPlants() {
    return this.http.get<Plant[]>(`${environment.apiBaseUrl}/api/plants`);
  }

  getPlant(plantId: string) {
    return this.http.get<Plant>(
      `${environment.apiBaseUrl}/api/plants/${plantId}`
    );
  }

  addPlant(plant: AddPlantDTO) {
    return this.http.post<Plant>(`${environment.apiBaseUrl}/api/plants`, plant);
  }

  updatePlant(plantId: string, updatePlant: UpdatePlantDTO) {
    return this.http.patch<Plant>(
      `${environment.apiBaseUrl}/api/plants/${plantId}`,
      updatePlant
    );
  }
  
  deletePlant(plantId: string) {
    return this.http.delete(`${environment.apiBaseUrl}/api/plants/${plantId}`);
  }
}
