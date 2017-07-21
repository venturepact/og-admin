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
  UserApprovalComponent,
  VerifyEmailComponent,
  VerifyUserComponent
} from '../../site/index';
import {SalesforceRedirectComponent} from './../../site/redirectUri/salesforce/salesforce-redirect.component';
import {AweberRedirectComponent} from './../../site/redirectUri/aweber/aweber-redirect.component';
import {SlackRedirectComponent} from './../../site/redirectUri/slack/slack-redirect.component';

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
        path: 'verifyEmail/:token',
        component: VerifyEmailComponent
      },
      {
        path: 'authorize/salesforce',
        component: SalesforceRedirectComponent
      },
      {
        path: 'authorize/slack',
        component: SlackRedirectComponent
      },
      {
        path: 'authorize/aweber',
        component: AweberRedirectComponent
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
        path: 'userApproval',
        component: UserApprovalComponent
      },
      // {
      //   path:'company-profile',
      //   component: CompanyProfileComponent,
      //   canActivate:[CompanyProfileRouteGuard]
      // },
      {
        path: 'forgetPassword',
        component: ForgetPasswordComponent
      }
    ]
  },
  {
    path: 'analytics',
    loadChildren: 'app/site/components/+analytics/analytics.module#AnalyticsModule',
    canActivate: [FreemiumGuard, AuthGuard, AnalyticsGuard]
  },
  {
    path: 'templates',
    loadChildren: 'app/site/components/+templates/templates.module#TemplatesModule'
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
    path: 'dashboard',
    loadChildren: 'app/site/components/+dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard, FreemiumGuard]
  },
  {
    path: 'settings',
    loadChildren: 'app/site/+Settings/settings.module#SettingsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'appsumo',
    loadChildren: 'app/site/components/+signup/signup.module#SignUpModule',
    canActivate: [LoginGuard]
  },
  {
    path: 'dealfuel',
    loadChildren: 'app/site/components/+signup/signup.module#SignUpModule',
    canActivate: [LoginGuard]
  },
  {
    path: 'affiliates',
    loadChildren: 'app/site/components/+signup/signup.module#SignUpModule',
    canActivate: [LoginGuard]
  },
  {
    path: 'appsumo_black',
    loadChildren: 'app/site/components/+signup/signup.module#SignUpModule',
    canActivate: [LoginGuard]
  },
  {
    path: 'signup',
    loadChildren: 'app/site/components/+signup/signup.module#SignUpModule',
    canActivate: [LoginGuard]
  },
  {
    path: 'builder',
    loadChildren: 'app/site/+builder/builder.module#BuilderModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'preview',
    loadChildren: 'app/site/templates/templateAll/preview.module#PreviewModule',
    canActivate: [AuthGuard, FreemiumGuard]
  },
  {
    path: 'samplecode',
    loadChildren: 'app/site/templates/templateAll/sampleCode.module#SampleCodeModule',
    canActivate: [AuthGuard, FreemiumGuard]
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
