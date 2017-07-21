import {Routes} from '@angular/router';
import {HomeComponent, SiteComponent} from './../../site/index';
import {AuthGuard} from '../../shared/authentication/auth.guard';
import {LoginGuard} from '../../shared/authentication/login.guard';
import {AdminGuard} from '../../shared/authentication/admin.guard';
import {SubdomainGuard} from '../../shared/authentication/subdomain.guard';
import {AnalyticsGuard} from '../../shared/authentication/analytics.guard';
import {FeatureAuthService} from '../../shared/services/feature-access.service';
import {HomeRouteGuard} from '../../shared/authentication/home-route.guard';
import {CompanyProfileRouteGuard} from '../../shared/authentication/company-profile-route.guard';
import {NotFoundComponent} from '../../shared/notfound/notfound.component';
import {LogoutComponent} from '../../shared/logout/logout.component';
import {LoginComponent} from '../../shared/login/index';
import {FreemiumGuard} from '../../shared/authentication/freemium.guard';
import {SetupNewPasswordGuard} from '../../shared/authentication/setupnew-password.guard';
import {
  ForgetPasswordComponent,
  SetPasswordComponent,
  VerifyUserComponent
} from '../../site/index';

export const SITE_ROUTES: Routes = [

  {
    path: '',
    component: SiteComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'verify/:token',
        component: VerifyUserComponent
      },
      {
        path: 'setNewPassword',
        component: SetPasswordComponent,
        canActivate: [SetupNewPasswordGuard]
      },
      {
        path: 'setNewPassword/forgetPassword',
        component: SetPasswordComponent,
        canActivate: [SetupNewPasswordGuard]
      },
      {
        path: 'forgetPassword',
        component: ForgetPasswordComponent
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

export const AUTH_PROVIDERS = [AuthGuard, LoginGuard, AdminGuard, HomeRouteGuard, SubdomainGuard, CompanyProfileRouteGuard, AnalyticsGuard, FeatureAuthService, FreemiumGuard, SetupNewPasswordGuard];
