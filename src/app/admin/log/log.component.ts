import { Component, OnInit, AfterViewInit, NgModule } from "@angular/core";
import { AdminService } from "../../shared/services/admin.service";
import { Router } from "@angular/router";
import { CookieService, Script } from "../../shared/services";
import { Datatable } from "../../shared/interfaces/datatable.interface";

@Component({
  selector: "log",
  templateUrl: "./log.component.html",
  styleUrls: [
    "./log.component.css",
    "../../site/components/+analytics/assets/css/daterangepicker.css",
    "./../search-calc/search-calc.component.css"
  ]
})
export class LogComponent extends Datatable {
  apiSelect: string;
  apiSwitched: boolean;

  APIs = [
    {value: 'default', viewValue: 'Default'},
    {value: 'LIVE_API', viewValue: 'Live API'}
  ];

  // Base Values
  modalData: any;
  dateData: any;
  onErrorTab = true;
  searchQuery: string = "";
  APISource = "default";

  constructor(
    public _script: Script,
    public _adminService: AdminService,
    public _cookieService: CookieService,
    public router: Router
  ) {
    super();
    if (this._cookieService.readCookie("storage")) {
      let storage = JSON.parse(this._cookieService.readCookie("storage"));
      if (storage.user.sub_role !== null)
        this.router.navigate(["/admin/users"]);
    }
  }

  ngOnInit() {
    this.dateData = this.formatDate(new Date());
    // console.log('logs')
    // this.updateFilterOptions();
  }

  tabChanged(e) {
    this.onErrorTab = !this.onErrorTab;
    this.searchQuery = "";
    this.dateData = this.formatDate(new Date());
    this.APISource = "default";
  }


  // @desc: Format Date to Kabab-Case style to load the correct file
  formatDate(d) {
    let month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  // @desc: API Change Request
  changeAPISource() {
    this.searchQuery = "";
    this.dateData = this.formatDate(new Date());
    this._adminService.API_URL_SUBJECT.next(this.APISource);
  }

  // @desc: Apply Date Change
  applyDateChange(date) {
    this.searchQuery = "";
    this.dateData = this.formatDate(new Date(date));
  }
}
