import { Component, OnInit } from '@angular/core';
import { AdminService } from "../../shared/services/admin.service";
declare var moment: any;
declare var window: any;
declare var bootbox: any;
@Component({
  selector: 'cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.css']
})
export class CancelRequestComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
    // this.getCancelRequests();
  }

  getCancelRequests() {
    this.adminService.getCancelRequest().subscribe(
      (success) => {
        console.log('getCancelRequests Success : ', success);
      }, (error) => {
        console.error('getCancelRequests error : ', error);
      }
    );
  }
}
