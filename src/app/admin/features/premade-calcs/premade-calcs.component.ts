import { environment } from './../../../../environments/environment';
import { Script } from './../../../shared/services/script.service';
import { PremadeCalcsService } from './../services/premade-calcs.service';
import { Datatable } from './../../../shared/interfaces/datatable.interface';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from './../../../shared/services/admin.service';
declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'premade-calcs',
  templateUrl: './premade-calcs.component.html',
  styleUrls: ['./premade-calcs.component.css',
    './../../../site/components/+analytics/assets/css/daterangepicker.css'],
  encapsulation: ViewEncapsulation.None
})
export class PremadeCalcsComponent{
  
}
