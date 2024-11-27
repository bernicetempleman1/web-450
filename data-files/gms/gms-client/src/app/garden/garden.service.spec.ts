import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GardenService } from './garden.service';
import { Garden } from './garden';
import { environment } from '../../environments/environment';
import { UpdateGardenDTO } from './garden';
import { AddGardenDTO } from './garden';

describe('GardenService', () => {
  let service: GardenService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GardenService],
    });
    service = TestBed.inject(GardenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all gardens', () => {
    const dummyGardens: Garden[] = [
      {
        _id: '1',
        gardenId: 1,
        name: 'Garden 1',
        location: 'Location 1',
        description: 'Description 1',
      },
      {
        _id: '2',
        gardenId: 2,
        name: 'Garden 2',
        location: 'Location 2',
        description: 'Description 2',
      },
    ];
    service.getGardens().subscribe((gardens) => {
      expect(gardens.length).toBe(2);
      expect(gardens).toEqual(dummyGardens);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/gardens`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyGardens);
  });

  it('should retrieve a single garden by ID', () => {
    const dummyGarden: Garden = {
      _id: '1',
      gardenId: 1,
      name: 'Garden 1',
      location: 'Location 1',
      description: 'Description 1',
    };
    service.getGarden(1).subscribe((garden) => {
      expect(garden).toEqual(dummyGarden);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/gardens/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyGarden);
  });

  it('should add a new garden', () => {
    const newGarden: AddGardenDTO = {
      _id: '3',
      gardenId: 3,
      name: 'Garden 3',
      location: 'Location 3',
      description: 'Description 3',
    };
    service.addGarden(newGarden).subscribe((garden) => {
      expect(garden).toEqual(newGarden);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/gardens`);
    expect(req.request.method).toBe('POST');
    req.flush(newGarden);
  });

  it('should update an existing garden', () => {
    const updateGardenDTO: UpdateGardenDTO = {
      name: 'Updated Garden',
      location: 'Updated Location',
      description: 'Updated Description',
    };
    const updatedGarden: Garden = {
      _id: '1',
      gardenId: 1,
      name: 'Updated Garden',
      location: 'Updated Location',
      description: 'Updated Description',
    };
    service.updateGarden(updateGardenDTO, 1).subscribe((garden) => {
      expect(garden).toEqual(updatedGarden);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/gardens/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedGarden);
  });

  it('should delete a garden by ID', () => {
    service.deleteGarden(1).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/gardens/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
