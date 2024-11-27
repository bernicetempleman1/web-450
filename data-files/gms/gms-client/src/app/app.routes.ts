import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GardenListComponent } from './garden/garden-list/garden-list.component';
import { GardenDetailsComponent } from './garden/garden-details/gardendetails.component';
import { GardenAddComponent } from './garden/garden-add/garden-add.component';
import { PlantListComponent } from './plant/plant-list/plant-list.component';
import { PlantAddComponent } from './plant/plant-add/plant-add.component';
import { PlantDetailsComponent } from './plant/plant-details/plant-details.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'gardens',
    component: GardenListComponent,
  },
  {
    path: 'gardens/add',
    component: GardenAddComponent,
  },
  {
    path: 'gardens/:gardenId',
    component: GardenDetailsComponent,
  },
  {
    path: 'plants',
    component: PlantListComponent,
  },
  {
    path: 'plants/add',
    component: PlantAddComponent,
  },
  {
    path: 'plants/:plantId',
    component: PlantDetailsComponent,
  },
];
