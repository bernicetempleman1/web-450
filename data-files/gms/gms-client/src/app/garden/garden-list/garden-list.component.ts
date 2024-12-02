import { Component } from '@angular/core';
import { GardenService } from '../garden.service';
import { Garden } from '../garden';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, map, of } from 'rxjs';
@Component({
  selector: 'app-garden-list',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  template: `
<div class="garden-page">
<h1 class="garden-page__title">Garden List</h1>

<div class="garden-page__search-container">
<input type="text" placeholder="Search gardens by name"
[formControl]="txtSearchControl" class="garden-page__search" />
</div>

<button class="garden-page__button" routerLink="/gardens/add">Add Garden</button>
@if (serverMessage) {
<div [ngClass]="{'message-alert': serverMessageType === 'error', 'message-success': serverMessageType === 'success'}" >
{{ serverMessage }}
</div>
}
@if (gardens.length > 0) {
<table class="garden-page__table">
<thead class="garden-page__table-head">
<tr class="garden-page__table-row">
<th class="garden-page__table-header">Garden ID</th>
<th class="garden-page__table-header">Name</th>
<th class="garden-page__table-header">Location</th>
<th class="garden-page__table-header">Description</th>
<th class="garden-page__table-header">Date Created</th>
<th class="garden-page__table-header">Functions</th>
</tr>
</thead>
<tbody class="garden-page__table-body">
@for (garden of gardens; track garden) {
<tr class="garden-page__table-row">
<td class="garden-page__table-cell">{{ garden.gardenId }}</td>
<td class="garden-page__table-cell">{{ garden.name }}</td>
<td class="garden-page__table-cell">{{ garden.location }}</td>
<td class="garden-page__table-cell">{{ garden.description }}</td>
<td class="garden-page__table-cell">{{ garden.dateCreated }}</td>
<td class="garden-page__table-cell garden-page__table-cell--functions">
<a routerLink="/gardens/{{garden.gardenId}}" class="garden-page__iconlink"><i class="fas fa-edit"></i></a>
<a (click)="deleteGarden(garden.gardenId)" class="garden-page__icon-link"><i class="fas fa-trash-alt"></i></a>
</td>
</tr>
}
</tbody>
</table>
} @else {
<p class="garden-page__no-gardens">No gardens found, consider adding one...</p>
}
</div>
`,
  styles: `
.garden-page {
max-width: 80%;
margin: 0 auto;
padding: 20px;
}
.garden-page__title {
text-align: center;
color: #563d7c;
}
.garden-page__table {
width: 100%;
border-collapse: collapse;
}
.garden-page__table-header {
background-color: #FFE484;
color: #000;
border: 1px solid black;
padding: 5px;
text-align: left;
}
.garden-page__table-cell {
border: 1px solid black;
padding: 5px;
text-align: left;
}
.garden-page__table-cell--functions {
text-align: center;
}
.garden-page__icon-link {
cursor: pointer;
color: #6c757d;
text-decoration: none;
margin: 0 5px;
}
.garden-page__icon-link:hover {
color: #000;
}
.garden-page__no-gardens {
text-align: center;
color: #6c757d;
}
.garden-page__button {
background-color: #563d7c;
color: #fff;
border: none;
padding: 10px 20px;
text-align: center;
text-decoration: none;
display: inline-block;
margin: 10px 2px;
cursor: pointer;
border-radius: 5px;
transition: background-color 0.3s;
}
.garden-page__button:hover {
background-color: #6c757d;
}
.message-alert {
padding: 15px;
margin-bottom: 20px;
border: 1px solid transparent;
border-radius: 4px;
color: #a94442;
background-color: #f2dede;
border-color: #ebccd1;
}
.message-success {
padding: 15px;
margin-bottom: 20px;
border: 1px solid transparent;
border-radius: 4px;
color: #3c763d;
background-color: #dff0d8;
border-color: #d6e9c6;
}
.garden-page__search-container {
display: flex;
align-items: center;
margin-bottom: 1rem;
}
.garden-page__search {
flex: 1;
padding: 0.5rem;
margin-right: 0.5rem;
}
`,
})
export class GardenListComponent {
  gardens: Garden[] = [];
  allGardens: Garden[] = [];
  serverMessage: string | null = null;
  serverMessageType: 'success' | 'error' | null = null;
  txtSearchControl = new FormControl('');
  constructor(private gardenService: GardenService) {
    this.gardenService.getGardens().subscribe({
      next: (gardens: Garden[]) => {
        this.gardens = gardens;
        this.allGardens = gardens;
        console.log(`Gardens: ${JSON.stringify(this.gardens)}`);
      },
      error: (err: any) => {
        console.error(`Error occurred while retrieving gardens: ${err}`);
      },
    });
    this.txtSearchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((val) => this.filterGardens(val || ''));
  }
  filterGardens(name: string) {
    this.gardens = this.allGardens.filter((g) =>
      g.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  deleteGarden(gardenId: number) {
    if (!confirm('Are you sure you want to delete this garden?')) {
      return;
    }
    this.gardenService.deleteGarden(gardenId).subscribe({
      next: () => {
        console.log(`Garden with ID ${gardenId} deleted successfully`);
        this.gardens = this.gardens.filter((g) => g.gardenId !== gardenId);
        this.serverMessageType = 'success';
        this.serverMessage = `Garden with ID ${gardenId} deleted successfully`;
        this.clearMessageAfterDelay();
      },
      error: (err: any) => {
        console.error(
          `Error occurred while deleting garden with ID ${gardenId}: ${err}`
        );
        this.serverMessageType = 'error';
        this.serverMessage = `Error occurred while deleting garden with ID ${gardenId}. Please
  try again later.`;
        this.clearMessageAfterDelay();
      },
    });
  }
  private clearMessageAfterDelay() {
    setTimeout(() => {
      this.serverMessage = null;
      this.serverMessageType = null;
    }, 3000);
  }
}
