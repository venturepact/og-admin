import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { CoreModule } from "./core.module";

import { AppComponent } from "./app.component";
import { routes, APP_ROUTER_PROVIDERS } from "./config/routes/index";
import { SharedModule } from "./shared/modules/shared.module";
import { NotFoundComponent } from "./shared/notfound/notfound.component";
import { LoginComponent } from "./shared/login/login.component";
import { LogoutComponent } from "./shared/logout/logout.component";
import { HomeComponent } from "./site/+home/home.component";
import { SiteModule } from "./site/site.module";

// Animation Module for the effects in angular-material
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from './shared/modules/material.module';
// import { setTheme } from 'ngx-bootstrap/utils';
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
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule.forRoot(),
    SiteModule
  ],
  providers: [APP_ROUTER_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor() {
  //   setTheme('bs4'); // or 'bs3'
  // }
}
