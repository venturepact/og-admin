import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {CoreModule} from './core.module';

import {AppComponent} from './app.component';
import {routes, APP_ROUTER_PROVIDERS} from './config/routes/index';
import {SharedModule} from './shared/modules/shared.module';
import {NotFoundComponent} from './shared/notfound/notfound.component';
import {LoginComponent} from './shared/login/login.component';
import {LogoutComponent} from './shared/logout/logout.component';
import {HomeComponent} from './site/+home/home.component';
import {SiteModule} from './site/site.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    routes,
    SharedModule,
    BrowserModule,
    CoreModule.forRoot(),
    SiteModule,
  ],
  providers: [
    APP_ROUTER_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
