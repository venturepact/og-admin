import {Component, OnInit} from '@angular/core';
import {Script} from '../../shared/services/script.service';
import {AdminService} from '../../shared/services/admin.service';
import {Router} from "@angular/router";
import {CookieService} from "../../shared/services/cookie.service";
declare var jQuery: any;

@Component({
  selector: 'error-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  $getErrorList;
  scriptloaded = false;
  logs: Array<String>;
  message: String;
  folderName: String

  constructor(public _script: Script, public _adminService: AdminService, public _cookieService: CookieService, public router: Router) {
    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      if(storage.user.sub_role !== null)
        this.router.navigate(['/admin/users']);
    }
  }

  ngOnInit() {
    this._adminService.getlogType().subscribe((data) => {
      this.folderName = data;
      let dateObj = new Date();
      let dateString = this.formateDate(dateObj);
      console.log(dateString);
      this.requestForLog(dateString, this.folderName);
    });
    var $cont = jQuery('#logContainer');
    console.log($cont[0]);
    $cont[0].scrollTop = $cont[0].scrollHeight;
  }

  requestForLog(dateString, folder) {
    this._adminService.getLog({selectedDate: dateString, folder: folder}).subscribe((response) => {
      console.log(response);
      this.logs = response;
      this.message = '';
    }, (response) => {
      this.message = 'No log found!!';
      this.logs = [];
    });
  }

  formateDate(d) {
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onDateSelect(date: any) {
    console.log(date);

    //this.$getErrorList= this._adminService.getLog({selectedDate:date.start_date,folder:this.folderName});
    this.requestForLog(date.start_date, this.folderName);


  }

  onRefresh() {
    let dateObj = new Date();
    let dateString = this.formateDate(dateObj);
    console.log(dateString);
    this.requestForLog(dateString, this.folderName);
  }
}

