import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AdminService} from '../../shared/services/admin.service';
import {Script} from '../../shared/services/script.service';
import {Router} from "@angular/router";
import {CookieService} from "../../shared/services/cookie.service";

declare var jQuery: any;
declare var google: any;
declare var moment: any;
declare var Morris: any;

@Component({
  selector: 'og-basic-detail',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class BasicComponent implements OnInit, AfterViewInit {
  start_date: String;
  end_date: String;
  postData: any = {
    start_date: moment().subtract(10, 'days').format('YYYY-MM-DD'),
    end_date: moment().add(1, 'day').format('YYYY-MM-DD')
  };
  app_count: number = 0;
  user_count: number = 0;
  company_count: number = 0;
  overviewChart: any;
  scriploaded: boolean = false;
  graphLoader: boolean = false;
  data: any;

  constructor(public _adminService: AdminService, public script: Script,public _cookieService: CookieService,
              public router: Router,) {

  }

  ngOnInit() {
    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      if(storage.user.sub_role !== null)
        this.router.navigate(['/admin/users']);
    }
  }

  ngAfterViewInit() {
    this.script.load('raphael', 'morrisCharts', 'daterangepicker', 'moment')
      .then((data) => {
        this.scriploaded = true;
        this.initializeGraph();
        this.getGraphData();
      })
      .catch((error) => {
        console.log('script load error', error);
      });

  }

  initializeGraph() {
    this.overviewChart = Morris.Line({
      element: 'area-example',
      data: [{y: '0', a: 0, b: 0, c: 0}],
      xkey: 'y',
      ykeys: ['a', 'b', 'c'],
      labels: ['Calc Created', 'Users Created', 'Company Created'],
      fillOpacity: 0.1,
      hideHover: 'auto',
      behaveLikeLine: true,
      resize: true,
      pointFillColors: ['#fb545b'],
      pointStrokeColors: ['#269fd8'],
      lineColors: ['#fb545b', '#269fd8', ' #2eb82e'],
    });
  }


  getGraphData() {
    this.graphLoader = true;
    this._adminService.getBasicGraph(this.postData).subscribe((result) => {
      // console.log("graph data", result);
      this.overviewChart.setData(result.graph);
      this.data = result;
      this.app_count = result.app;
      this.user_count = result.user;
      this.company_count = result.company;
      this.graphLoader = false;
    }, (error) => {
      console.log("error in graph data service", error);
    });
  }

  onDateSelect(date: any) {
    this.start_date = date.start_date;
    this.end_date = date.end_date;
    this.postData.start_date = date.start_date;
    this.postData.end_date = date.end_date;
    // refresh stats
    this.getGraphData();
  }

  mouseEnter(line: string, color: string) {
    jQuery('#area-example').empty();
    let mychart: any = Morris.Line({
      element: 'area-example',
      data: [{y: '0', a: 0, b: 0, c: 0}],
      xkey: 'y',
      ykeys: [line],
      labels: ['Calc Created', 'Users Created', 'Company Created'],
      fillOpacity: 0.1,
      hideHover: 'auto',
      behaveLikeLine: true,
      resize: true,
      pointFillColors: ['#fb545b'],
      pointStrokeColors: ['#269fd8'],
      lineColors: [color],
    });
    mychart.setData(this.data.graph);
  }

  mouseLeave(line: string) {
    jQuery('#area-example').empty();
    this.overviewChart = Morris.Line({
      element: 'area-example',
      data: [{y: '0', a: 0, b: 0, c: 0}],
      xkey: 'y',
      ykeys: ['a', 'b', 'c'],
      labels: ['Calc Created', 'Users Created', 'Company Created'],
      fillOpacity: 0.1,
      hideHover: 'auto',
      behaveLikeLine: true,
      resize: true,
      pointFillColors: ['#fb545b'],
      pointStrokeColors: ['#269fd8'],
      lineColors: ['#fb545b', '#269fd8', ' #2eb82e'],
    });
    this.overviewChart.setData(this.data.graph);

  }


}
