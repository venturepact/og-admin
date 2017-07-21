import {SharedModule} from './../../../shared/modules/shared.module';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { SignupDetailComponent } from './index';

const SIGNUP_ROUTES: Routes = [
  {
    path: '',
    component: SignupDetailComponent
  },
  {
    path: ':email',
    component: SignupDetailComponent
  },
  {
    path: 'appsumo',
    component: SignupDetailComponent
  },
  {
    path: 'dealfuel',
    component: SignupDetailComponent
  },
  {
    path: 'affiliates',
    component: SignupDetailComponent
  },
  {
    path: 'appsumo_black',
    component: SignupDetailComponent
  }
]

@NgModule({
  declarations: [SignupDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(SIGNUP_ROUTES)
  ],
  exports: [],
  providers: []
})
export class SignUpModule { }
