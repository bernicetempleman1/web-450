import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantService } from '../plant.service';
import { Plant } from '../plant';

@Component({
  selector: 'app-plant-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="plant-details-page">
      <h1 class="plant-details-page__title">Plant Details</h1>
      <h4 class="plant-details-page__subtitle">
        Explore the detailed information about your selected plant, including
        its type and status.
      </h4>
      <div class="plant-details-page__card">
        <form [formGroup]="plantForm" class="plant-details-page__form">

          <div class="plant-details-page__form-group">
            <label for="name" class="plant-details-page__form-label"
              >Plant Name</label
            >
            <input
              type="text"
              id="name"
              class="plant-details-page__form-control"
              formControlName="name"
            />
          </div>
          <div class="plant-details-page__form-group">
            <label for="type" class="plant-details-page__form-label"
              >Plant Type</label
            >
            <select
              id="type"
              class="plant-details-page__form-control"
              formControlName="type"
            >
              <option value="Flower">Flower</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Herb">Herb</option>
              <option value="Tree">Tree</option>
            </select>
          </div>
          <div class="plant-details-page__form-group">
            <label for="status" class="plant-details-page__form-label"
              >Plant Status</label
            >
            <select
              id="status"
              class="plant-details-page__form-control"
              formControlName="status"
            >
              <option value="Planted">Planted</option>
              <option value="Growing">Growing</option>
              <option value="Harvested">Harvested</option>
            </select>
          </div>
          <button
            type="submit"
            (click)="onSubmit()"
            class="plant-details-page__btn"
          >
            Save Changes
          </button>
        </form>
      </div>
      <br />
      <a class="plant-details-page__link" routerLink="/plants">Return</a>
    </div>
  `,
  styles: `
.plant-details-page {
max-width: 80%;
margin: 0 auto;
padding: 20px;
}
.plant-details-page__title {
text-align: center;
color: #563d7c;
}
.plant-details-page__subtitle {
text-align: center;
color: #563d7c;
font-size: 0.9rem;
font-style: italic;
margin-bottom: 20px;
}
.plant-details-page__card {
background: #fff;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
padding: 20px;
margin-top: 20px;
}
.plant-details-page__form {
display: flex;
flex-direction: column;
}
.plant-details-page__form-group {
  margin-bottom: 15px;
}
.plant-details-page__form-label {
display: block;
margin-bottom: 5px;
font-weight: bold;
}
.plant-details-page__form-control {
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
}
.plant-details-page__btn {
padding: 10px 15px;
background-color: #563d7c;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
align-self: flex-start;
}
.plant-details-page__btn:hover {
background-color: #452a63;
}
.plant-details-page__link {
color: #563d7c;
text-decoration: none;
display: block;
}
.plant-details-page__link:hover {
text-decoration: underline;
}
`,
})
export class PlantDetailsComponent {
  plantId: string;
  plant: Plant;
  plantForm: FormGroup = this.fb.group({
    name: [
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ],
    type: [null, Validators.required],
    status: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private plantService: PlantService
  ) {
    this.plantId = this.route.snapshot.paramMap.get('plantId') || '';
    this.plant = {} as Plant;
    if (this.plantId === '') {
      this.router.navigate(['/plants']);
      return;
    }
    
    this.plantService.getPlant(this.plantId).subscribe({
      next: (plant: Plant) => {
        this.plant = plant;
        this.plantForm.setValue({
          name: plant.name,
          type: plant.type,
          status: plant.status,
        });
      },
    });
  }
  onSubmit() {
    if (this.plantForm.valid) {
      const updatePlantDTO = {
        name: this.plantForm.controls['name'].value,
        type: this.plantForm.controls['type'].value,
        status: this.plantForm.controls['status'].value,
      };
      console.log('Update Plant DTO:', updatePlantDTO);
      this.plantService.updatePlant(this.plantId, updatePlantDTO).subscribe({
        next: (result: any) => {
          console.log(`PlantId: ${result.plantId} ${result.message}`);
          this.router.navigate(['/plants']);
        },
        error: (err: any) => {
          console.error('Error updating plant', err);
        },
      });
    }
  }
}
