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
import { GardenDetailsComponent } from './garden-details.component';
import { GardenService } from '../garden.service';
import { Garden, UpdateGardenDTO } from '../garden';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateGardenDTO } from '../garden';

describe('GardenDetailsComponent', () => {
  let component: GardenDetailsComponent;
  let fixture: ComponentFixture<GardenDetailsComponent>;
  let gardenService: GardenService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        GardenDetailsComponent,
      ],
      providers: [
        GardenService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GardenDetailsComponent);
    component = fixture.componentInstance;
    gardenService = TestBed.inject(GardenService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.gardenForm.controls['name'].setValue('Test Garden');
    component.gardenForm.controls['location'].setValue('Test Location');
    component.gardenForm.controls['description'].setValue('Test Description');
    expect(component.gardenForm.valid).toBeTrue();
  });

  it('should call updateGarden and navigate on successful form submission', fakeAsync(() => {
    const updateGardenDTO: UpdateGardenDTO = {
      name: 'Test Garden',
      location: 'Test Location',
      description: 'Test Description',
    };

    const mockGarden: Garden = {
      _id: '1',
      gardenId: 1,
      name: 'Test Garden',
      location: 'Test Location',
      description: 'Test Description',
      dateCreated: '2024-09-04T21:39:36.605Z',
    };

    spyOn(gardenService, 'updateGarden').and.returnValue(of(mockGarden));
    spyOn(router, 'navigate');
    component.gardenForm.controls['name'].setValue(updateGardenDTO.name);
    component.gardenForm.controls['location'].setValue(
      updateGardenDTO.location
    );
    component.gardenForm.controls['description'].setValue(
      updateGardenDTO.description
    );
    component.onSubmit();
    tick();
    expect(gardenService.updateGarden).toHaveBeenCalledWith(
      updateGardenDTO,
      component.gardenId
    );
    expect(router.navigate).toHaveBeenCalledWith(['/gardens']);
  }));

  it('should handle error on form submission failure', fakeAsync(() => {
    spyOn(gardenService, 'updateGarden').and.returnValue(
      throwError('Error updating garden')
    );
    spyOn(console, 'error');
    component.gardenForm.controls['name'].setValue('Test Garden');
    component.gardenForm.controls['location'].setValue('Test Location');
    component.gardenForm.controls['description'].setValue('Test Description');
    component.onSubmit();
    tick();
    expect(gardenService.updateGarden).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating garden',
      'Error updating garden'
    );
  }));
});
