import {NgModule} from '@angular/core';
import {SiteComponent} from './site.component';
import {routes} from "../config/routes/index";
import {SharedModule} from "../shared/modules/shared.module";
import { MaterialModule } from './../shared/modules/material.module';

@NgModule({
  declarations: [
    SiteComponent,
  ],
  imports: [
  routes,
    SharedModule,
    MaterialModule
  ],
  exports: [SiteComponent, MaterialModule],
  providers: []
})
export class SiteModule {
}
