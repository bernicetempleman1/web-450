import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PlantAddComponent } from './plant-add.component';
import { PlantService } from '../plant.service';
import { GardenService } from '../../garden/garden.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AddPlantDTO, Plant } from '../plant';

describe('PlantAddComponent', () => {
  let component: PlantAddComponent;
  let fixture: ComponentFixture<PlantAddComponent>;
  let plantService: PlantService;
  let gardenService: GardenService;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        PlantAddComponent,
      ],
      providers: [
        PlantService,
        GardenService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PlantAddComponent);
    component = fixture.componentInstance;
    plantService = TestBed.inject(PlantService);
    gardenService = TestBed.inject(GardenService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.plantForm.controls['name'].setValue('Test Plant');
    component.plantForm.controls['type'].setValue('Flower');
    component.plantForm.controls['status'].setValue('Planted');
    component.plantForm.controls['gardenId'].setValue(1);
    component.plantForm.controls['datePlanted'].setValue('2023-01-01');
    expect(component.plantForm.valid).toBeTrue();
    })
});
