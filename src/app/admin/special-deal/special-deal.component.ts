import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Script } from "../../shared/services/script.service";
import { Datatable } from "../../shared/interfaces/datatable.interface";
import { AdminService } from "../../shared/services/admin.service";

@Component({
  selector: 'og-special-deal',
  templateUrl: './special-deal.component.html',
  styleUrls: ['./../success-rate/success-rate.component.css']
})
export class SpecialDealComponent extends Datatable implements OnInit, AfterViewInit {

  loading: boolean = true;
  dealCouponsLogs: any = [];
  selectedCoupon: any;
  constructor(private _script: Script, private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.selectLog();
  }
  selectLog() {
    this.loading = true;
    this.adminService.getSpecialCouponCodeLogs(this.getParams()).subscribe(response => {
      this.loading = false;
      this.dealCouponsLogs = response.deal_coupons;
      this.total_pages = Math.ceil(response.count / this.current_limit);
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
      search: this.search
    };
  }
  selectCoupon(index) {
    this.selectedCoupon = this.dealCouponsLogs[index];
    console.log(typeof this.selectedCoupon);
  }
  paging(num: number) {
    super.paging(num);
    this.selectLog();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.selectLog();
  }

  previous() {
    super.previous();
    this.selectLog();
  }

  next() {
    super.next();
    this.selectLog();
  }

  searchData() {
    console.log("In search");
    super.searchData();
    this.selectLog();
  }

  generateKeys(obj) {
    console.log("obj", obj);
    return Object.keys(obj);
  }
  // beautifyCode(obj){
  //     return '<pre>' + this.extractAndModify(obj) + '</pre>'
  // }
  // extractAndModify(obj){
  //   let str = '';
  //   console.log("Object>>>>>>>>>>>>>>>",obj);
  //   Object.keys(obj).forEach(key=>{
  //     console.log(key,typeof obj[key]);
  //     if(typeof obj[key] == 'object'){
  //         if(!obj[key]) str+=this.wrapInSpan(key,obj[key]);
  //         else this.extractAndModify(key);
  //     }
  //       // this.extractAndModify(obj[key]);
  //     str += this.wrapInSpan(key,obj[key]) + '<br/>';
  //   })
  //   return str;
  // }
  // wrapInSpan(key,value){
  //   return '<span><i>' + key + '  :-  </i>' + value +'</span>'
  // }

}
