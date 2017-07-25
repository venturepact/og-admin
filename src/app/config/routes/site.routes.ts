import {Routes} from '@angular/router';
import {HomeComponent, SiteComponent} from './../../site/index';
import {LoginGuard} from '../../shared/authentication/login.guard';
import {AdminGuard} from '../../shared/authentication/admin.guard';
import {NotFoundComponent} from '../../shared/notfound/notfound.component';
import {LogoutComponent} from '../../shared/logout/logout.component';
import {LoginComponent} from '../../shared/login/index';

export const SITE_ROUTES: Routes = [

  {
    path: '',
    component: SiteComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [LoginGuard]
      }
    ]
  },
  {
    path: 'login/:email',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AdminGuard]
  },
  {
    path: 'Error',
    component: NotFoundComponent
  },
];

export const AUTH_PROVIDERS = [LoginGuard, AdminGuard];
