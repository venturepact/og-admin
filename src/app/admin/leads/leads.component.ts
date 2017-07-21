import { Component, AfterViewInit } from '@angular/core';
import { AdminService} from './../../shared/services/admin.service';
import { Datatable } from '../../shared/interfaces/datatable.interface';
import {Script} from '../../shared/services/script.service';

declare var jQuery: any;

@Component({
  selector: 'og-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css', './../ionicons.min.css'],
})

export class LeadsComponent extends Datatable implements AfterViewInit {
  loading: boolean = false;
  allLeads:Object = [];
  constructor(public _adminService: AdminService, public _script: Script) {
    super();
  }
  ngAfterViewInit() {
    this._script.load('datatables')
      .then((data) => {
        this.getAllLeads();
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });

    // console.log(this.date_from,'this.date_to',this.date_to);
  }

  getAllLeads() {
    let self = this;
    self.loading = true;
    self.allLeads = [];
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search,
      from: this.date_from,
      to: this.date_to
    };
    let getAllLeads = self._adminService.getAllLeads(obj)
      .subscribe(
        (success: any) => {
          self.allLeads = success.leads;
          self.loading = false;
          this.total_pages = Math.ceil(success.count / this.current_limit);
        },
        (error: any) => {
          console.log('error leads', error);
          getAllLeads.unsubscribe();
        }
      );
  }

  paging(num: number) {
    super.paging(num);
    this.getAllLeads();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getAllLeads();
  }

  previous() {
    super.previous();
    this.getAllLeads();
  }

  next() {
    super.next();
    this.getAllLeads();
  }

  searchData() {
    if(this.date_from){
      if(!this.date_to)
        this.date_to = new Date().toISOString().split('T')[0];
    }
    // console.log('from:',this.date_from,'to:',this.date_to);
    super.searchData();
    this.getAllLeads();
  }
}
