import { BrowserModule } from '@angular/platform-browser';
import { NgModule,APP_INITIALIZER } from '@angular/core';
import { CoreModule } from './core.module';

import { AppComponent } from './app.component';
import { routes, APP_ROUTER_PROVIDERS } from './config/routes/index';
import { SharedModule } from './shared/modules/shared.module';
import { NotFoundComponent } from './shared/notfound/notfound.component';

import {SignupComponent} from './site/components/+signup/index';
import {LoginComponent} from './shared/login/login.component';
import {LogoutComponent} from './shared/logout/logout.component';
import {FeatureAuthService} from './shared/services/feature-access.service';
import {HomeComponent} from './site/+home/home.component';
import {PipesModule} from './site/templates/pipes/pipes.module';
import { SiteModule } from './site/site.module';
import {MarketingService} from './shared/services/marketing.service';
import {SubDomainService} from './shared/services/subdomain.service';

export function subDomainServiceFactory (_subDomainService: SubDomainService) {
  return () => _subDomainService.subDomainExists();
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    routes,
    SharedModule,
    BrowserModule,
    CoreModule.forRoot(),
    SiteModule,
    PipesModule
  ],
  providers: [
    FeatureAuthService,
    APP_ROUTER_PROVIDERS,
    MarketingService,
    {
      provide: APP_INITIALIZER,
      useFactory: subDomainServiceFactory,
      deps: [SubDomainService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
