// import { Component, OnInit } from '@angular/core';
// import { AdminService } from '../../shared/services/admin.service';
// import { Router } from "@angular/router";
// import { CookieService, Script } from "../../shared/services";
// import { Datatable } from '../../shared/interfaces/datatable.interface';

// declare var jQuery: any;

// @Component({
//   selector: 'error-log',
//   templateUrl: './log.component.html',
//   styleUrls: ['./log.component.css'
//     , '../../site/components/+analytics/assets/css/daterangepicker.css',
//     './../search-calc/search-calc.component.css']
// })
// export class LogComponent extends Datatable implements AfterViewInit, OnInit {
//   scriptLoaded = false;
//   logs: Array<String>;
//   message: String;
//   folderName: String;
//   dateme: string;
//   firsTime = true;
//   isLoading = false;

//   constructor(public _script: Script, public _adminService: AdminService,
//     public _cookieService: CookieService, public router: Router) {
//     super();
//     if (this._cookieService.readCookie('storage')) {
//       let storage = JSON.parse(this._cookieService.readCookie('storage'));
//       if (storage.user.sub_role !== null)
//         this.router.navigate(['/admin/users']);
//     }
//   }

//   ngOnInit() {
//     this._adminService.getlogType().subscribe((data) => {
//       this.folderName = data;
//       let dateObj = new Date();
//       let dateString = this.formateDate(dateObj);
//       console.log(dateString);
//       this.requestForLog(dateString, this.folderName);
//     });

//     let $cont = jQuery('#logContainer');
//     console.log($cont[0]);
//     $cont[0].scrollTop = $cont[0].scrollHeight;
//   }

//   ngAfterViewInit() {
//     this._script.load('daterangepicker', 'datatables')
//       .then((data) => {
//         this.scriptLoaded = true;
//         // this.requestForLog(this.dateme, this.folderName);
//       })
//       .catch((error) => {
//         console.log('Script not loaded', error);
//       });
//   }

//   requestForLog(dateString, folder) {
//     let obj = {
//       limit: this.current_limit,
//       page: this.current_page - 1,
//       // searchKey: this.search,
//       selectedDate: dateString,
//       folder: folder,
//       isFirstTime: this.firsTime
//     };
//     this._adminService.getLog({ selectedDate: dateString, folder: folder }).subscribe((response) => {
//       console.log(response);
//       this.logs = response;
//       this.message = '';
//     }, (response) => {
//       this.message = 'No log found!!';
//       this.logs = [];
//     });
//   }

//   formateDate(d) {
//     let month = '' + (d.getMonth() + 1),
//       day = '' + d.getDate(),
//       year = d.getFullYear();

//     if (month.length < 2) month = '0' + month;
//     if (day.length < 2) day = '0' + day;

//     return [year, month, day].join('-');
//   }

//   onDateSelect(date: any) {
//     console.log(date);
//     //this.$getErrorList= this._adminService.getLog({selectedDate:date.start_date,folder:this.folderName});
//     this.requestForLog(date.start_date, this.folderName);
//   }

//   onRefresh() {
//     let dateObj = new Date();
//     let dateString = this.formateDate(dateObj);
//     console.log(dateString);
//     this.requestForLog(dateString, this.folderName);
//   }
// }


import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { Router } from "@angular/router";
import { CookieService, Script } from "../../shared/services";
import { Datatable } from '../../shared/interfaces/datatable.interface';

declare var jQuery: any;

@Component({
  selector: 'error-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'
    , '../../site/components/+analytics/assets/css/daterangepicker.css',
    './../search-calc/search-calc.component.css']
})
export class LogComponent extends Datatable {
  scriptLoaded = false;
  logs: Array<String>;
  message: String;
  folderName: String;
  dateme: string;
  firsTime = true;
  isLoading = false;
  search: string;
  searchON = true;

  constructor(public _script: Script, public _adminService: AdminService,
    public _cookieService: CookieService, public router: Router) {
    super();
    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      if (storage.user.sub_role !== null)
        this.router.navigate(['/admin/users']);
    }
  }

  ngOnInit() {
    this.loadScripts(); // remomve this
    this._adminService.getlogType().subscribe((data) => {
      this.folderName = data || 'errorLogs';
      let dateObj = new Date();
      let dateString = this.formateDate(dateObj);
      this.dateme = dateString; // here
      console.log('nb', dateString, this.folderName);
      this.requestForLog(this.dateme, this.folderName);
    });

    let $cont = jQuery('#logContainer');
    console.log($cont[0]);
    $cont[0].scrollTop = $cont[0].scrollHeight;
  };
  loadScripts() {
    this._script.load('datatables', 'daterangepicker')
      .then((data) => {
        this.scriptLoaded = true;
        // this.requestForLog(this.dateme, this.folderName);
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });

    jQuery('.modal').on('hidden.bs.modal', function () {
      this.error = false;
      this.errorMessage = '';
    });
    jQuery('.daterangepicker').click(() => {
      alert('select date');
    })
  }

  requestForLog(dateString, folder) {
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      // searchKey: this.search,
      selectedDate: dateString,
      folder: folder,
      searchKey: this.search,
      isFirstTime: this.firsTime
    };
    this.isLoading = true;
    // this.searchON = true;
    this.message = 'loading...';
    this._adminService.getLog(obj).subscribe((response) => {
      console.log(response);
      this.logs = response.logs;
      this.searchON = false;
      this.isLoading = false;
      console.log('current limit: ', Math.ceil(response.count / this.current_limit), this.current_limit);
      this.total_pages = Math.ceil(response.count / this.current_limit);
      this.message = '';
    }, (error) => {
      this.message = 'No log found!!';
      console.log(this.message);
      this.searchON = true;
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
    console.log(jQuery('.input-daterange-datepicker'));
    this.firsTime = true;
    console.log(date);
    this.reset();
    //this.$getErrorList= this._adminService.getLog({selectedDate:date.start_date,folder:this.folderName});
    this.dateme = date.start_date;
    this.requestForLog(this.dateme, this.folderName);
  }

  onRefresh() {
    this.firsTime = true;
    let dateObj = new Date();
    this.reset();
    let dateString = this.formateDate(dateObj);
    this.onDateSelect(dateString);
    this.dateme = dateString;
    console.log(dateString);
    this.requestForLog(dateString, this.folderName);
  }

  paging(num: number) {
    this.firsTime = false;
    super.paging(num);
    this.requestForLog(this.dateme, this.folderName);
  }
  //
  previous() {
    this.firsTime = false;
    super.previous();
    this.requestForLog(this.dateme, this.folderName);
  }
  //
  next() {
    this.firsTime = false;
    super.next();
    this.requestForLog(this.dateme, this.folderName);
  }

  limitChange(event: any) {
    this.firsTime = false;
    super.limitChange(event);
    this.requestForLog(this.dateme, this.folderName);
  }

  searchData() {
    if(this.search.length > 2 || this.search.length === 0){
      super.searchData();
      this.firsTime = false;
      this.requestForLog(this.dateme, this.folderName);
    }
  }
}


