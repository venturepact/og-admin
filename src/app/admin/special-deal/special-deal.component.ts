import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Script} from "../../shared/services/script.service";
import {Datatable} from "../../shared/interfaces/datatable.interface";
import {AdminService} from "../../shared/services/admin.service";

@Component({
  selector: 'og-special-deal',
  templateUrl: './special-deal.component.html',
  styleUrls: ['./../success-rate/success-rate.component.css']
})
export class SpecialDealComponent extends Datatable implements OnInit, AfterViewInit {

  loading: boolean = false;
  dealCouponsLogs: any = [];

  constructor(private _script: Script, private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.adminService.getSpecialCouponCodeLogs(this.getParams()).subscribe(response => {
      this.dealCouponsLogs = response.deal_coupons;
      //  this.total_pages=r
    });
  }

  ngAfterViewInit(): void {
    this._script.load('datatables')
      .then((data) => {
      }).catch((error) => {
      console.log('Script not loaded', error);
    });
  }

  getParams() {
    return {
      limit: this.current_limit,
      page: this.current_page - 1,
    };
  }

}
