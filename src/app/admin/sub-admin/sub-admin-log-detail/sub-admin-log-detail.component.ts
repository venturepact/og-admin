import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../shared/services/admin.service';
import {ActivatedRoute} from "@angular/router";
import {JSONCompare} from "../../../shared/services/helper-service/json-compare";
declare var jQuery: any;
@Component({
  selector: 'app-sub-admin-log-detail',
  templateUrl: './sub-admin-log-detail.component.html',
  styleUrls: ['./sub-admin-log-detail.component.css'],
})
export class SubAdminLogDetailComponent implements OnInit {
  logId: String;
  beforeChange: any = '';
  afterChange: any = '';
  user: any = '';
  log: any = '';
  comp: any = {};
  constructor(private adminService: AdminService,private route: ActivatedRoute, private _JSONCompare: JSONCompare){
    this.route.params.subscribe(params => {
      this.logId = params['id'];
    });
  }

  ngOnInit(): void {
  
    this.getLogById();
  }

  getLogById(){
    let self = this;
    let getLogById = self.adminService.getLogById(self.logId)
      .subscribe(
        (success: any) => {
          
          this.log = success;
          this.user = success.user.emails[0].email;
          this.beforeChange = JSON.parse(success.before_change);
          this.afterChange = JSON.parse(success.after_change);
          var t0 = performance.now();
          this._JSONCompare.compareJson(this.beforeChange,this.afterChange);  
          var t1 = performance.now();
          console.log("Call to JSON Comparison took " + (t1 - t0) + " milliseconds.")
          console.log('beforeChange',this.beforeChange);
          console.log('afterChange',this.afterChange);
        },
         (error: any) => {
          console.log('getLogById() error', error);
        }
      );
  }
  generateKeys(obj){
      return Object.keys(obj);
  }

  dateFormat(date: any) {
    let d = new Date(date);
    return d.toString().split('GMT')[0];
  }
}


