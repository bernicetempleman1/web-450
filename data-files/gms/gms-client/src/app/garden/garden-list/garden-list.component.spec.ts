import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GardenListComponent } from './garden-list.component';
import { GardenService } from '../garden.service';
import { of, throwError } from 'rxjs';
import { Garden } from '../garden';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { AddGardenDTO } from '../garden';

describe('GardenListComponent', () => {
  let component: GardenListComponent;
  let fixture: ComponentFixture<GardenListComponent>;
  let gardenService: GardenService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        GardenListComponent,
      ], //Import GardenListComponent
      providers: [GardenService],
    }).compileComponents();
    fixture = TestBed.createComponent(GardenListComponent);
    component = fixture.componentInstance;
    gardenService = TestBed.inject(GardenService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error when fetching gardens', () => {
    spyOn(gardenService, 'getGardens').and.returnValue(
      throwError('Error fetching gardens')
    );
    fixture.detectChanges(); // Trigger the component's constructor
    expect(component.gardens.length).toBe(0);
  });

  it('should delete a garden', () => {
    const mockGardens: Garden[] = [
      {
        _id: '1',
        gardenId: 1,
        name: 'Garden 1',
        location: 'Location 1',
        description: 'Description 1',
        dateCreated: '2024-09-04T21:39:36.605Z',
      },
      {
        _id: '2',
        gardenId: 2,
        name: 'Garden 2',
        location: 'Location 2',
        description: 'Description 2',
        dateCreated: '2024-09-05T21:39:36.605Z',
      },
    ];

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(gardenService, 'deleteGarden').and.returnValue(of({}));
    component.gardens = mockGardens;
    component.deleteGarden(1);
    fixture.detectChanges(); // Update the view with the deletion state
    expect(component.gardens.length).toBe(1);
    expect(component.gardens[0].gardenId).toBe(2);
  });
});
