import { FeatureLayoutManagerComponent } from './../components/feature-layout-manager/feature-layout-manager.component';
import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { SelectModule } from 'ng2-select';
@NgModule({
  declarations: [FeatureLayoutManagerComponent],
  imports: [ SelectModule,CommonModule, FormsModule],
  exports: [ CommonModule, FormsModule, HttpModule,
     ReactiveFormsModule, SelectModule, FeatureLayoutManagerComponent ]
})
export class SharedModule { }
