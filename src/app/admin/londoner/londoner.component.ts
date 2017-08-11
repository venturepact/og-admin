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
  calculatorData: any;
  calculator: any = [];
  timeData = [];
  search = '';
  constructor(private _http: LondonerService) {
    super();
  }

  ngOnInit() {
    this._http.getSoundCloud()
      .subscribe(data => {
        console.log('Data:  ', data);
        for (let d of data) {
          if (d.company) {
            this.calculator.push(d);
            (typeof d.time_to_email != 'undefined') ? this.timeData.push(d.time_to_email) : this.timeData.push(0);
          }
        }
        this.calculatorData = this.calculator;
        this.loading = false;
      }
      , err => console.log('Err: ', err))
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
      console.log('Running e')
      this.timeData = [];
      this.calculator = this.calculatorData;
      for (let d of this.calculator) {
        (typeof d.time_to_email != 'undefined') ? this.timeData.push(d.time_to_email) : this.timeData.push(0);
      }
    }
    else {
      console.log('Running t')
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
}
