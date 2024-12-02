
import { PlantListComponent } from './plant-list.component';
import { PlantService } from '../plant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Plant } from '../plant';
import { By } from '@angular/platform-browser';
import { Garden } from '../../garden/garden';

describe('PlantListComponent', () => {
  let component: PlantListComponent;
  let fixture: ComponentFixture<PlantListComponent>;
  let plantService: PlantService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        PlantListComponent,
      ], //import PlantListComponent
      providers: [PlantService],
    }).compileComponents();
    fixture = TestBed.createComponent(PlantListComponent);
    component = fixture.componentInstance;
    plantService = TestBed.inject(PlantService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should handle error when fetching plants', () => {
    spyOn(plantService, 'getPlants').and.returnValue(
      throwError('Error fetching plants')
    );
    fixture.detectChanges(); // Trigger the component's constructor
    expect(component.plants.length).toBe(0);
  });

  it('should delete a plant', () => {
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
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(plantService, 'deletePlant').and.returnValue(of({}));
    component.plants = mockPlants;
    component.deletePlant('1');
    fixture.detectChanges(); // Update the view with the deletion state
    expect(component.plants.length).toBe(1);
    expect(component.plants[0]._id).toBe('2');
  });

  it('should filter plants based on filter type', () => {
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
      {
        _id: '3',
        gardenId: 1,
        name: 'Carrot',
        type: 'Vegetable',
        status: 'Planted',
        datePlanted: '2023-01-03',
      },
    ];
    component.plants = mockPlants;
    component.allPlants = mockPlants;
    fixture.detectChanges(); // Trigger change detection
    component.filterType = 'Flower';
    component.filterPlants();
    fixture.detectChanges(); // Trigger change detection
    expect(component.plants.length).toBe(2);
    expect(component.plants[0].name).toBe('Rose');
    expect(component.plants[1].name).toBe('Tulip');
    component.filterType = 'Vegetable';
    component.filterPlants();
    fixture.detectChanges(); // Trigger change detection
    expect(component.plants.length).toBe(1);
    expect(component.plants[0].name).toBe('Carrot');
    component.filterType = '';
    component.filterPlants();
    fixture.detectChanges(); // Trigger change detection
    expect(component.plants.length).toBe(3);
  });
});
