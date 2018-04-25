import {Component, Input, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {AdminService} from '../../../../../shared/services/admin.service';
import {Script} from './../../../../../shared/services/script.service';
import {Datatable} from '../../../../../shared/interfaces/datatable.interface';
declare var jQuery: any;
declare var window: any;
declare var moment: any;

@Component({
  selector: 'usage-cycle',
  templateUrl: './usage-cycle.component.html',
  styleUrls: ['./../../../../../../assets/css/sahil-hover.css',
    './../../../../../../assets/css/custom-material.css', './usage-cycle.component.css']
})
export class UsageCycleComponent extends Datatable implements OnInit, OnDestroy, AfterViewInit {
  @Input() company: any;
  subscribes: any[];
  companyUsageCycle: any[];
  moment: any;
  loading: boolean;
  constructor(private _adminService: AdminService, private _router: Router, private _script: Script) {
    super();
    this.subscribes = [];
    this.moment = moment;
    this.loading = true;
  }

  ngOnInit() {
    this.subscribes.push(this.getCompanyUsageCycle());
  }

  ngOnDestroy() {
    this.subscribes.forEach((subscribe) => {
      subscribe.unsubscribe();
    });
  }
  
  ngAfterViewInit() {

    this._script.load('datatables')
      .then((data) => {
        // this.companyType = 'all';
        // this.getAllCompany();
      }).catch((error) => {
      console.log('Script not loaded', error);
    });
  }

  getCompanyUsageCycle() {
    this.loading = true;
    return this._adminService.getCompUsageCycle(this.company.id).subscribe((success) => {
      this.companyUsageCycle = success;
      this.loading = false;
    }, (error) => {
      console.log('get usage cycle error ', error);
    });
  }
}
