import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../shared/services';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.css']
})
export class SheetsComponent implements OnInit {
  public allCalculatorIds = [];
  public allLiveCalcs = [];
  public sheetArr = [];
  public resetInfo: Boolean = false;
  public viewInfo: Boolean = false;
  public exportInfo: Boolean = false;
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
      this.exportInfo = false;
    } else if (value == 'view') {
      this.resetInfo = false;
      this.viewInfo = true;
      this.exportInfo = false;
    } else if (value == 'export') {
      this.exportInfo = true;
      this.resetInfo = false;
      this.viewInfo = false;
    } else {
      this.resetInfo = false;
      this.viewInfo = false;
      this.exportInfo = false;
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
  getLivecalcs() {
    if (!this.searchText) return window.alert('please enter subdomain');
    this._companyService.getAllCalcs(this.searchText).subscribe((res) => {
      if (res.message) {
        window.alert(res.message);
      } else if (res.length) {
        this.allLiveCalcs = res.filter((ele) => {
          if (ele.liveApp) return ele;
        });
      } else {
        this.errorInfo1 = true;
      }
    });
  }
  exportSheet(appId, value) {
    let data = {
      id: appId,
      offset: new Date().getTimezoneOffset(),
      lead: false,
      userObj: {
        primaryEmail: 'admin@outgrow.co',
        name: 'admin'
      }
    };
    if (value == 'Export leads') {
      data.lead = true;
    } 
    this._companyService.exportToSheetAsync(data).subscribe((res) => {
      if (res == 'syncing')
        return window.alert('Currently we are processing your previous request');
      else
        return window.alert('Processing your request');
    });
  }

}
