import { RouterModule, Routes }  from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { SITE_ROUTES , AUTH_PROVIDERS} from './site.routes';
//import { BUILDER_ROUTES } from './builder.routes';
// import { HTTP_PROVIDERS} from '@angular/http';

import { LoggedInService, UserService, CompanyService } from '../../shared/services/index';
import {ADMIN_PROVIDERS} from "./admin.routes";
const routing: Routes = [
  ...SITE_ROUTES,
  // ...ADMIN_ROUTES,
  // ...BUILDER_ROUTES
];
export const routes: ModuleWithProviders = RouterModule.forRoot(routing);

export const APP_ROUTER_PROVIDERS = [
  AUTH_PROVIDERS,
  // LoggedInService,
  // UserService,
  // CompanyService,
  // HTTP_PROVIDERS,
  ADMIN_PROVIDERS
];
