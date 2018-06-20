import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../shared/services';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.css']
})
export class SheetsComponent implements OnInit {
  public allCalculatorIds=[];
  public sheetArr = [];
  public resetInfo: Boolean = false;
  public viewInfo: Boolean = false;
  public errorInfo: Boolean = false;
  public errorInfo1: Boolean = false;
  public searchText: string = '';
  public nameMapping: string = '';
  public passCode: string = 'out@in';
  constructor(private _companyService: CompanyService) {

  }

  ngOnInit() {
  }

  selectChanges(event: any) {
    let value = event.target.value;
    if (value == 'reset') {
      this.resetInfo = true;
      this.viewInfo = false;
    } else if (value == 'view') {
      this.resetInfo = false;
      this.viewInfo = true;
    } else {
      this.resetInfo = false;
      this.viewInfo = false;
    }
  }
  getcalculators() {
    if (!this.searchText) return window.alert('please enter subdomain');
    this._companyService.getAllCalcs(this.searchText).subscribe((res) => {
      if (res.message) {
        window.alert(res.message);
      } else if (res.length) {
        this.allCalculatorIds = res;
      } else {
        this.errorInfo1 = true;
      }
    });
  }
  resetSheets(appId) {
    this._companyService.resetAppConfig(appId, this.passCode).subscribe((res) => {
      window.alert('Resetted successfully');
    });
  }
  sheetsView() {
    if (!this.searchText) return window.alert('please enter subdomain');
    this._companyService.getSheets(this.searchText, this.passCode).subscribe((res) => {
      if (res.sheets) {
        this.sheetArr = res.sheets.filter((ele) => {
          if (ele.sheets.length > 0) return ele;
        });
        if (!this.sheetArr.length) {
          this.errorInfo = true;
        }
        this.nameMapping = res.nameMapping;
      }
      else if (res.message) {
        window.alert(res.message);
      }
    });
  }

}
