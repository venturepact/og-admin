import { Component, OnInit } from '@angular/core';
import { AdminService } from "../../shared/services/admin.service";
import { Script } from '../../shared/services';
import { AllCompaniesComponent } from '../companies/all-companies/all-companies.component';
import { Observable } from 'rxjs/Observable';
declare var window: any;
declare var bootbox: any;
declare var Morris:any;
declare var jQuery:any;
@Component({
  selector: 'cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.css']
})
export class CancelRequestComponent implements OnInit {
  overviewChartForMmr: any;
  overviewChartForCancelledCompanies: any;
  graphLoader: boolean = false;
  count: any;
  data: any;
  graphLoader1: boolean = false;
  loading: boolean = false;
  cancellationRequests: any;
  upgrades: any;
  downgrades: any;
  mrrSelection:any;
  result: any;
  cancellationCustomers: any;
  trialToActivated: any;
  trialSignups: any;
  monthlySummaryMrr: any;
  constructor(private adminService: AdminService, private script:Script) {
  }

  ngOnInit() {
    this.getAllMrr();
  }



  initializeGraphForCancelledCompanies() {
    this.overviewChartForCancelledCompanies = Morris.Line({
      element: 'area-example',
      data: [{date:'0', count:0}],
      xkey: 'date',
      parseTime: false,
      ykeys: ['count'],
      labels: ['Cancelled Companies'],
      lineColors: ['#fb545b'],
    });
  }

  initializeGraphForMmr() {
    this.overviewChartForMmr = Morris.Line({
      element: 'area-example1',
      data: [{date:'0', mrr:0}],
      xkey: 'date',
      parseTime: false,
      ykeys: ['mrr'],
      hideHover: 'auto',
      labels: ['Companies Mrr'],
      lineColors: ['green'],
    });
  }
  async getAllMrr() {
    this.loading = true;
    Observable.forkJoin([
      this.adminService.cancellationRequests(),
      this.adminService.upgrades(),
      this.adminService.downgrades(),
      this.adminService.trialToActivated(),
      this.adminService.trialSignups(),
      this.adminService.cancellationCustomers(),
      this.adminService.monthlySummaryMrr()
    ]).subscribe(
      (response: any) => {
        this.cancellationRequests = response[0];
        this.upgrades = response[1];
        this.downgrades = response[2];
        this.trialToActivated = response[3];
        this.trialSignups = response[4]
        this.cancellationCustomers = response[5];
        this.monthlySummaryMrr = response[6];
        this.loading = false
      },
      (error: any) => {
        this.loading = false
      }
    )
  }

  // preferenceChange() {
  //   if(this.mrrSelection === 'cancellationRequests'){
  //     this.result = this.cancellationRequests
  //   } else if(this.mrrSelection === 'cancellationCustomers'){
  //     this.result = this.cancellationCustomers
  //   } else if(this.mrrSelection === 'upgrades'){
  //     this.result = this.upgrades
  //   } else if(this.mrrSelection === 'downgrades'){
  //     this.result = this.downgrades
  //   } else if(this.mrrSelection === 'trialToActivated'){
  //     this.result = this.trialToActivated
  //   }else if(this.mrrSelection === 'trialSignups'){
  //     this.result = this.trialSignups
  //   }
  // }

}
