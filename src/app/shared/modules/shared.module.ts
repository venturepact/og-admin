import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [],
  imports: [],
  exports:[CommonModule, FormsModule, HttpModule, ReactiveFormsModule]
})
export class SharedModule { }
