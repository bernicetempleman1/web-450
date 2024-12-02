import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PlantDetailsComponent } from './plant-details.component';
import { PlantService } from '../plant.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Plant } from '../plant';
describe('PlantDetailsComponent', () => {
let component: PlantDetailsComponent;
let fixture: ComponentFixture<PlantDetailsComponent>;
let plantService: PlantService;
let router: Router;
let activatedRoute: ActivatedRoute;
beforeEach(async () => {
await TestBed.configureTestingModule({
imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule,
PlantDetailsComponent],
providers: [
PlantService,
{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
]
}).compileComponents();
fixture = TestBed.createComponent(PlantDetailsComponent);
component = fixture.componentInstance;
plantService = TestBed.inject(PlantService);
router = TestBed.inject(Router);
activatedRoute = TestBed.inject(ActivatedRoute);
fixture.detectChanges();
});
it('should create', () => {
  expect(component).toBeTruthy();
  });

  it('should call updatePlant and navigate on successful form submission', fakeAsync(() => {
    const updatePlantDTO = {
    name: 'Test Plant',
    type: 'Flower',
    status: 'Planted'
    };
    const mockResponse: Plant = {
    _id: '1',
    gardenId: 1,
    name: 'Test Plant',
    type: 'Flower',
    status: 'Planted',
    datePlanted: '2023-01-01',
    dateHarvested: '2023-01-15',
    dateCreated: '2023-01-01',
    dateModified: '2023-01-15'
    };
    spyOn(plantService, 'updatePlant').and.returnValue(of(mockResponse));
    spyOn(router, 'navigate');
    component.plantForm.controls['name'].setValue(updatePlantDTO.name);
    component.plantForm.controls['type'].setValue(updatePlantDTO.type);
    component.plantForm.controls['status'].setValue(updatePlantDTO.status);
    component.onSubmit();
    tick();
    expect(plantService.updatePlant).toHaveBeenCalledWith('1', updatePlantDTO);
    expect(router.navigate).toHaveBeenCalledWith(['/plants']);
    }));

    it('should handle error on form submission failure', fakeAsync(() => {
      spyOn(plantService, 'updatePlant').and.returnValue(throwError('Error updating plant'));
      spyOn(console, 'error');
      component.plantForm.controls['name'].setValue('Test Plant');
      component.plantForm.controls['type'].setValue('Flower');
      component.plantForm.controls['status'].setValue('Planted');
      component.onSubmit();
      tick();
      expect(plantService.updatePlant).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error updating plant', 'Error updating plant');
      }));
});
