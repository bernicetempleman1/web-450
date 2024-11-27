import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { GardenAddComponent } from './garden-add.component';
import { GardenService } from '../garden.service';
import { AddGardenDTO, Garden } from '../garden';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddGardenDTO } from '../garden';

describe('GardenAddComponent', () => {
  let component: GardenAddComponent;
  let fixture: ComponentFixture<GardenAddComponent>;
  let gardenService: GardenService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        GardenAddComponent,
      ],
      providers: [
        GardenService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GardenAddComponent);
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
    component.gardenForm.controls['dateCreated'].setValue(
      '2024-09-04T21:39:36.605Z'
    );
    expect(component.gardenForm.valid).toBeTrue();
  });

  it('should call addGarden and navigate on successful form submission', () => {
    const addGardenDTO: AddGardenDTO = {
      name: 'Test Garden',
      location: 'Test Location',
      description: 'Test Description',
      dateCreated: '2024-09-04T21:39:36.605Z',
    };

    const mockGarden: Garden = {
      _id: '1',
      gardenId: 1,
      name: 'Test Garden',
      location: 'Test Location',
      description: 'Test Description',
      dateCreated: '2024-09-04T21:39:36.605Z',
    };
    spyOn(gardenService, 'addGarden').and.returnValue(of(mockGarden));
    spyOn(router, 'navigate');
    component.gardenForm.controls['name'].setValue(addGardenDTO.name);
    component.gardenForm.controls['location'].setValue(addGardenDTO.location);
    component.gardenForm.controls['description'].setValue(
      addGardenDTO.description
    );
    component.gardenForm.controls['dateCreated'].setValue(
      addGardenDTO.dateCreated
    );
    component.onSubmit();
    expect(gardenService.addGarden).toHaveBeenCalledWith(addGardenDTO);
    expect(router.navigate).toHaveBeenCalledWith(['/gardens']);
  });

  it('should handle error on form submission failure', () => {
    spyOn(gardenService, 'addGarden').and.returnValue(
      throwError('Error creating garden')
    );
    spyOn(console, 'error');
    component.gardenForm.controls['name'].setValue('Test Garden');
    component.gardenForm.controls['location'].setValue('Test Location');
    component.gardenForm.controls['description'].setValue('Test Description');
    component.gardenForm.controls['dateCreated'].setValue(
      '2024-09-04T21:39:36.605Z'
    );
    component.onSubmit();
    expect(gardenService.addGarden).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error creating garden',
      'Error creating garden'
    );
  });
});
