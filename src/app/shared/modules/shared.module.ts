import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { SelectModule } from 'ng2-select';
@NgModule({
  declarations: [],
  imports: [ SelectModule ],
  exports: [ CommonModule, FormsModule, HttpModule, ReactiveFormsModule, SelectModule ]
})
export class SharedModule { }
