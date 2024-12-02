import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PlantService } from './plant.service';
import { Plant } from './plant';
import { environment } from '../../environments/environment';
import { AddPlantDTO } from './plant';
import { UpdatePlantDTO } from './plant';

describe('PlantService', () => {
  let service: PlantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlantService],
    });

    service = TestBed.inject(PlantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve a list of plants from the API', () => {
    const mockPlants: Plant[] = [
      {
        _id: '1',
        gardenId: 1,
        name: 'Rose',
        type: 'Flower',
        status: 'Planted',
        datePlanted: '2023-01-01',
      },
      {
        _id: '2',
        gardenId: 1,
        name: 'Tulip',
        type: 'Flower',
        status: 'Planted',
        datePlanted: '2023-01-02',
      },
    ];
    service.getPlants().subscribe((plants) => {
      expect(plants.length).toBe(2);
      expect(plants).toEqual(mockPlants);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/plants`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlants);
  });

  it('should retrieve a single plant by ID from the API', () => {
    const mockPlant: Plant = {
      _id: '1',
      gardenId: 1,
      name: 'Rose',
      type: 'Flower',
      status: 'Planted',
      datePlanted: '2023-01-01',
    };
    service.getPlant('1').subscribe((plant) => {
      expect(plant).toEqual(mockPlant);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/plants/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlant);
  });

  it('should add a new plant via the API', () => {
    const newPlant: AddPlantDTO = { name: 'Sunflower', type: 'Flower', status: 'Planted' };
    const mockResponse: Plant = { _id: '3', gardenId: 1, ...newPlant, datePlanted: '2023-01-03' };
    service.addPlant(1, newPlant).subscribe(plant => {
    expect(plant).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/plants/1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPlant);
    req.flush(mockResponse);
    });

  it('should update an existing plant via the API', () => {
    const updatedPlant: UpdatePlantDTO = {
      name: 'Sunflower',
      type: 'Flower',
      status: 'Harvested',
    };
    const mockResponse: Plant = {
      _id: '3',
      gardenId: 1,
      ...updatedPlant,
      datePlanted: '2023-01-03',
      dateHarvested: '2023-01-04',
    };
    service.updatePlant('1', updatedPlant).subscribe((plant) => {
      expect(plant).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/plants/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedPlant);
    req.flush(mockResponse);
  });

  it('should delete an existing plant via the API', () => {
    service.deletePlant('1').subscribe((response) => {
      expect(response).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/plants/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
