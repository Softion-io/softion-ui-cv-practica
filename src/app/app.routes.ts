import { Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';

export const routes: Routes = [
  {
    path: '',
    component: StartComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'personal-data', component: PersonalDataComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
