import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GardenService } from '../garden.service';
import { AddGardenDTO } from '../garden';
@Component({
  selector: 'app-garden-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="garden-add-page">
      <h1 class="garden-add-page__title">Add New Garden</h1>
      <h4 class="garden-add-page__subtitle">
        Fill in the details to create a new garden.
      </h4>
      <div class="garden-add-page__card">
        <form [formGroup]="gardenForm" class="garden-add-page__form">
          <div class="garden-add-page__form-group">
            <label for="name" class="garden-add-page__form-label"
              >Garden Name</label
            >
            <input
              type="text"
              id="name"
              class="garden-add-page__form-control"
              formControlName="name"
            />
          </div>
          <div class="garden-add-page__form-group">
            <label for="location" class="garden-add-page__form-label"
              >Garden Location</label
            >
            <input
              type="text"
              id="location"
              class="garden-add-page__form-control"
              formControlName="location"
            />
          </div>
          <div class="garden-add-page__form-group">
            <label for="description" class="garden-add-page__form-label"
              >Garden Description</label
            >
            <textarea
              id="description"
              rows="10"
              class="garden-add-page__form-control"
              formControlName="description"
            ></textarea>
          </div>
          <div class="garden-add-page__form-group">
            <label for="dateCreated" class="garden-add-page__form-label"
              >Date Created</label
            >
            <input
              type="datetime-local"
              id="dateCreated"
              class="garden-add-page__formcontrol"
              formControlName="dateCreated"
            />
          </div>
          <button
            type="submit"
            class="garden-add-page__btn"
            (click)="onSubmit()"
          >
            Add Garden
          </button>
        </form>
      </div>
      <br />
      <a class="garden-add-page__link" routerLink="/gardens">Return</a>
    </div>
  `,
  styles: `
.garden-add-page {
max-width: 80%;
margin: 0 auto;
padding: 20px;
}
.garden-add-page__title {
text-align: center;
color: #563d7c;
}
.garden-add-page__subtitle {
text-align: center;
color: #563d7c;
font-size: .9rem;
font-style: italic;
margin-bottom: 20px;
}
.garden-add-page__card {
background: #fff;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
padding: 20px;
margin-top: 20px;
}
.garden-add-page__form {
display: flex;
flex-direction: column;
}
.garden-add-page__form-group {
margin-bottom: 15px;
}
.garden-add-page__form-label {
display: block;
margin-bottom: 5px;
font-weight: bold;
}
.garden-add-page__form-control {
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
}
.garden-add-page__btn {
padding: 10px 15px;
background-color: #563d7c;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
align-self: flex-start;
}
.garden-add-page__btn:hover {
background-color: #452a63;
}
.garden-add-page__link {
color: #563d7c;
text-decoration: none;
display: block;
}
.garden-add-page__link:hover {
text-decoration: underline;
}
`,
})
export class GardenAddComponent {
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
    dateCreated: [null, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private gardenService: GardenService
  ) {}
  onSubmit() {
    if (this.gardenForm.valid) {
      const dateCreated = new Date(
        this.gardenForm.controls['dateCreated'].value
      ).toISOString();
      const newGarden: AddGardenDTO = {
        name: this.gardenForm.controls['name'].value,
        location: this.gardenForm.controls['location'].value,
        description: this.gardenForm.controls['description'].value,
        dateCreated: dateCreated,
      };
      console.log('Creating Garden', newGarden);
      this.gardenService.addGarden(newGarden).subscribe({
        next: (result: any) => {
          console.log(`Garden created successfully: ${result.message}`);
          this.router.navigate(['/gardens']);
        },
        error: (error) => {
          console.error('Error creating garden', error);
        },
      });
    }
  }
}
