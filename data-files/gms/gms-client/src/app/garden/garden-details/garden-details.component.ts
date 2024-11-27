

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GardenService } from '../garden.service';
import { Garden, UpdateGardenDTO } from '../garden';
@Component({
  selector: 'app-garden-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="garden-details-page">
      <h1 class="garden-details-page__title">Garden Details</h1>
      <h4 class="garden-details-page__subtitle">
        Explore the detailed information about your selected garden, including
        its location, plants, and maintenance schedule.
      </h4>
      <div class="garden-details-page__card">
        <form [formGroup]="gardenForm" class="garden-details-page__form">
          <div class="garden-details-page__form-group">
            <label for="name" class="garden-details-page__form-label"
              >Garden Name</label
            >
            <input
              type="text"
              id="name"
              class="garden-details-page__form-control"
              formControlName="name"
            />
          </div>
          <div class="garden-details-page__form-group">
            <label for="location" class="garden-details-page__form-label"
              >Garden Location</label
            >
            <input
              type="text"
              id="location"
              class="garden-details-page__form-control"
              formControlName="location"
            />
          </div>
          <div class="garden-details-page__form-group">
            <label for="description" class="garden-details-page__form-label"
              >Garden Description</label
            >
            <textarea
              id="description"
              rows="10"
              class="garden-details-page__form-control"
              formControlName="description"
            ></textarea>
          </div>
          <button
            type="submit"
            class="garden-details-page__btn"
            (click)="onSubmit()"
          >
            Save Changes
          </button>
        </form>
      </div>
      <br />
      <a class="garden-details-page__link" routerLink="/gardens">Return</a>
    </div>
  `,
  styles: `
  .garden-details-page {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  }
  .garden-details-page__title {
  text-align: center;
  color: #563d7c;
  }
  .garden-details-page__subtitle {
    text-align: center;
color: #563d7c;
font-size: .9rem;
font-style: italic;
margin-bottom: 20px;
}
.garden-details-page__card {
background: #fff;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
padding: 20px;
margin-top: 20px;
}
.garden-details-page__form {
display: flex;
flex-direction: column;
}
.garden-details-page__form-group {
margin-bottom: 15px;
}
.garden-details-page__form-label {
display: block;
margin-bottom: 5px;
font-weight: bold;
}
.garden-details-page__form-control {
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
}
.garden-details-page__btn {
padding: 10px 15px;
background-color: #563d7c;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
align-self: flex-start;
}
.garden-details-page__btn:hover {
background-color: #452a63;
}
.garden-details-page__link {
color: #563d7c;
text-decoration: none;
display: block;
}
.garden-details-page__link:hover {
text-decoration: underline;
}
`,
})
export class GardenDetailsComponent {
  gardenId: number;
  garden: Garden;
  gardenForm: FormGroup = this.fb.group({
    name: [
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ],
    location: [
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ],
    description: [
      null,
      Validators.compose([Validators.required, Validators.minLength(10)]),
    ],
  });
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gardenService: GardenService
  ) {
    let l_gardenId = this.route.snapshot.paramMap.get('gardenId') || '';
    this.gardenId = parseInt(l_gardenId, 10);
    this.garden = {} as Garden;
    console.log('Garden ID', this.gardenId);
    if (isNaN(this.gardenId)) {
      this.router.navigate(['/gardens']);
      return;
    }
    this.gardenService.getGarden(this.gardenId).subscribe({
      next: (garden: Garden) => {
        if (!garden) {
          this.router.navigate(['/gardens']);
          return;
        }
        this.garden = garden;
        console.log('Garden Details', this.garden);
      },
      error: (error) => {
        console.error('Error fetching garden details', error);
      },
      complete: () => {
        this.gardenForm.controls['name'].setValue(this.garden.name);
        this.gardenForm.controls['location'].setValue(this.garden.location);
        this.gardenForm.controls['description'].setValue(
          this.garden.description
        );
      },
    });
  }
  onSubmit() {
    if (this.gardenForm.valid) {
      let l_garden: UpdateGardenDTO = {
        name: this.gardenForm.controls['name'].value,
        location: this.gardenForm.controls['location'].value,
        description: this.gardenForm.controls['description'].value,
      };
      console.log('Updating Garden', l_garden);
      this.gardenService.updateGarden(l_garden, this.gardenId).subscribe({
        next: (result: any) => {
          console.log(`GardenId: ${result.gardenId} ${result.message}`);
          this.router.navigate(['/gardens']);
        },
        error: (error) => {
          console.error('Error updating garden', error);
        },
      });
    }
  }
}
