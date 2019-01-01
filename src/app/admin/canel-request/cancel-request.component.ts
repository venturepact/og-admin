import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from "../../shared/services/admin.service";
import { Script } from '../../shared/services';
declare var moment: any;
declare var window: any;
declare var bootbox: any;
declare var Morris:any;
declare var jQuery:any;
@Component({
  selector: 'cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.css']
})
export class CancelRequestComponent implements OnInit, AfterViewInit {
  overviewChartForMmr: any;
  overviewChartForCancelledCompanies: any;
  graphLoader: boolean = false;
  count: any;
  data: any;
  graphLoader1: boolean = false;

  constructor(private adminService: AdminService, private script:Script) {
  }

  ngOnInit() {
    // this.getCancelRequests();
  }
  ngAfterViewInit() {
    this.script.load('raphael', 'morrisCharts', 'daterangepicker', 'moment')
    .then((data) => {
      this.initializeGraphForCancelledCompanies();
      this.initializeGraphForMmr();
      this.cancellationCompanies();
    })
    .catch((error) => {
      console.log('script load error', error);
    });
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
      data: [{date:'0', mmr:0}],
      xkey: 'date',
      parseTime: false,
      ykeys: ['mmr'],
      hideHover: 'auto',
      labels: ['Companies MMR'],
      lineColors: ['green'],
    });
  }

  cancellationCompanies() {
    this.graphLoader = true;
    this.graphLoader1 = true;
    this.adminService.cancellationCompanies().subscribe(
      (success) => {
        console.log('getCancelRequests Success : ', success);
        this.data = success;
        this.overviewChartForMmr.setData(this.data);
        this.overviewChartForCancelledCompanies.setData(this.data);
        this.graphLoader = false;
        this.graphLoader1 = false;
      }, (error) => {
        console.error('getCancelRequests error : ', error);
      }
    );
  }

}
