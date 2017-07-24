import {Routes} from '@angular/router';
import {HomeComponent, SiteComponent} from './../../site/index';
import {AuthGuard} from '../../shared/authentication/auth.guard';
import {LoginGuard} from '../../shared/authentication/login.guard';
import {AdminGuard} from '../../shared/authentication/admin.guard';
import {HomeRouteGuard} from '../../shared/authentication/home-route.guard';
import {NotFoundComponent} from '../../shared/notfound/notfound.component';
import {LogoutComponent} from '../../shared/logout/logout.component';
import {LoginComponent} from '../../shared/login/index';
import {SubdomainGuard} from "../../shared/authentication/subdomain.guard";

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
    path: 'signup',
    loadChildren: 'app/site/components/+signup/signup.module#SignUpModule',
    canActivate: [LoginGuard]
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

export const AUTH_PROVIDERS = [AuthGuard, LoginGuard, AdminGuard, HomeRouteGuard, SubdomainGuard];
