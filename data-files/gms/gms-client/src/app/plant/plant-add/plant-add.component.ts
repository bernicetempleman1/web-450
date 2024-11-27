import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PlantService } from '../plant.service';
import { GardenService } from '../../garden/garden.service';
import { AddPlantDTO } from '../plant';
@Component({
  selector: 'app-plant-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="plant-add-page">
      <h1 class="plant-add-page__title">Add New Plant</h1>
      <h4 class="plant-add-page__subtitle">
        Fill in the details to add a new plant.
      </h4>
      <div class="plant-add-page__card">
        <form [formGroup]="plantForm" class="plant-add-page__form">
          <div class="plant-add-page__form-group">
            <label for="name" class="plant-add-page__form-label"
              >Plant Name</label
            >
            <input
              type="text"
              id="name"
              class="plant-add-page__form-control"
              formControlName="name"
            />
          </div>
          <div class="plant-add-page__form-group">
            <label for="type" class="plant-add-page__form-label"
              >Plant Type</label
            >
            <select
              id="type"
              class="plant-add-page__form-control"
              formControlName="type"
            >
              <option value="Flower">Flower</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Herb">Herb</option>
              <option value="Tree">Tree</option>
            </select>
          </div>
          <div class="plant-add-page__form-group">
            <label for="status" class="plant-add-page__form-label"
              >Plant Status</label
            >
            <select
              id="status"
              class="plant-add-page__form-control"
              formControlName="status"
            >
              <option value="Planted">Planted</option>
              <option value="Growing">Growing</option>
              <option value="Harvested">Harvested</option>
            </select>
          </div>
          <div class="plant-add-page__form-group">
            <label for="gardenId" class="plant-add-page__form-label"
              >Garden</label
            >
            <select
              id="gardenId"
              class="plant-add-page__form-control"
              formControlName="gardenId"
            >
              @for (garden of gardens; track garden) {
              <option [value]="garden.gardenId">{{ garden.name }}</option>
              }
            </select>
          </div>
          <div class="plant-add-page__form-group">
            <label for="datePlanted" class="plant-add-page__form-label"
              >Date Planted</label
            >
            <input
              type="date"
              id="datePlanted"
              class="plant-add-page__form-control"
              formControlName="datePlanted"
            />
          </div>
          <button
            type="submit"
            (click)="onSubmit()"
            class="plant-add-page__btn"
          >
            Add Plant
          </button>
        </form>
      </div>
      <br />
      <a class="plant-add-page__link" routerLink="/plants">Return</a>
    </div>
  `,
  styles: `
.plant-add-page {
max-width: 80%;
margin: 0 auto;
padding: 20px;
}
.plant-add-page__title {
text-align: center;
color: #563d7c;
}
.plant-add-page__subtitle {
text-align: center;
color: #563d7c;
font-size: 0.9rem;
font-style: italic;
margin-bottom: 20px;
}
.plant-add-page__card {
background: #fff;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
padding: 20px;
margin-top: 20px;
}
.plant-add-page__form {
display: flex;
flex-direction: column;
}
.plant-add-page__form-group {
margin-bottom: 15px;
}
.plant-add-page__form-label {
display: block;
margin-bottom: 5px;
font-weight: bold;
}
.plant-add-page__form-control {
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
}
.plant-add-page__btn {
padding: 10px 15px;
background-color: #563d7c;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
align-self: flex-start;
}
.plant-add-page__btn:hover {
background-color: #452d5e;
}
.plant-add-page__link {
color: #563d7c;
text-decoration: none;
display: block;
}
.plant-add-page__link:hover {
text-decoration: underline;
}
`,
})
export class PlantAddComponent {
  gardens: any[] = [];
  plantForm: FormGroup = this.fb.group({
    name: [
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ],
    type: [null, Validators.required],
    status: [null, Validators.required],
    gardenId: [null, Validators.required],
    datePlanted: [null, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private plantService: PlantService,
    private gardenService: GardenService
  ) {
    this.gardenService.getGardens().subscribe({
      next: (gardens: any) => {
        this.gardens = gardens;
      },
    });
  }
  onSubmit() {
    if (this.plantForm.valid) {
      const gardenId = this.plantForm.controls['gardenId'].value;
      const datePlanted = new Date(
        this.plantForm.controls['datePlanted'].value
      ).toISOString();
      const newPlant: AddPlantDTO = {
        name: this.plantForm.controls['name'].value,
        type: this.plantForm.controls['type'].value,
        status: this.plantForm.controls['status'].value,
        datePlanted: datePlanted,
      };
      this.plantService.addPlant(gardenId, newPlant).subscribe({
        next: (result: any) => {
          console.log(`Plant created successfully: ${result.message}`);
          this.router.navigate(['/plants']);
        },
        error: (err: any) => {
          console.error('Error creating plant', err);
        },
      });
    }
  }
}
