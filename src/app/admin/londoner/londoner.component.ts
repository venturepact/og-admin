import { Component, OnInit } from '@angular/core';
import { LondonerService } from './../../shared/services/londoner.service';
import { Datatable } from './../../shared/interfaces/datatable.interface';

@Component({
  selector: 'app-londoner',
  templateUrl: './londoner.component.html',
  styleUrls: ['./londoner.component.css']
})
export class LondonerComponent extends Datatable implements OnInit {
  loading: boolean = true;
  calculatorData = [];
  calculator: any = [];
  timeData = [];
  search = '';
  currentSkip = 0;
  previousSkip = 0;
  nextClick = false;
  previousClick = false;
  totlaRecord: any;
  constructor(private _http: LondonerService) {
    super();
  }

  ngOnInit() {
    this._http.getSoundCloud({ limit: 50, skip: this.currentSkip })
      .subscribe(data => this.dataAlign(data), err => console.log('Err: ', err))
  }

  saveTime(i) {
    if (this.timeData[i]) {
      let id = this.calculator[i]._id;
      let timeVal = parseFloat(this.timeData[i]);
      this._http.updateTime({ id, timeVal })
        .subscribe(data => alert('Time Saved'), err => { alert('Not Saved'); console.log('Error:  ', err) })
    }
  }

  searchData() {
    if (this.search == '') {
      // console.log('Running e')
      this.timeData = [];
      this.calculator = this.calculatorData;
      for (let d of this.calculator) {
        (typeof d.time_to_email != 'undefined') ? this.timeData.push(d.time_to_email) : this.timeData.push(0);
      }
    }
    else {
      // console.log('Running t')
      this.calculator = [];
      this.timeData = [];
      for (let d of this.calculatorData) {
        if (d.name.substr(0, this.search.length) == this.search || d.company.sub_domain.substr(0, this.search.length) == this.search) {
          this.calculator.push(d);
          (typeof d.time_to_email != 'undefined') ? this.timeData.push(d.time_to_email) : this.timeData.push(0);
        }
      }
    }
  }

  nextClickFun() {
    this.loading = true;
    this._http.getSoundCloud({ limit: 50, skip: this.currentSkip })
      .subscribe(data => { this.dataAlign(data); }, err => console.log('Retrive Next Error', err))
  }
  previousClickFun() {
    this.loading = true;
    this._http.getPreviousData({ limit: this.currentSkip - 50 })
      .subscribe(data => {
        this.currentSkip = this.currentSkip - 100;
        this.dataAlign(data);
        //console.log('1111Current Skip:  ', this.currentSkip);
      }, err => console.log('Retrive Previous Error', err))
  }
  dataAlign(data) {
   // console.log('Run Function:::');
    this.calculator = [];
    this.calculatorData = [];
    this.timeData = [];
    this.totlaRecord = data.count;
    for (let d of data.data) {
      if (d.company) {
        (typeof d.time_to_email != 'undefined') ? this.timeData.push(d.time_to_email) : this.timeData.push(0);
        this.calculator.push(d);
      }
    }
    if (this.totlaRecord > (this.currentSkip) + 50) this.nextClick = true;
    else this.nextClick = this.previousClick = false;

    this.currentSkip = this.currentSkip + 50;
    if (this.currentSkip <= 50) this.previousClick = false;
    else this.previousClick = true;

    //console.log('Length is: ', this.calculatorData);
    this.loading = false;
    this.calculatorData = this.calculator;

    //console.log('Current Skip: ', this.currentSkip);
  }
}
