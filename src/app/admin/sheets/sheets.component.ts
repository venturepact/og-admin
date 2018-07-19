import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../shared/services';
declare var jQuery: any;
@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.css']
})
export class SheetsComponent implements OnInit {
  public sheetArr = [];
  public sheetUrlArr = [];
  public errorInfo: String = '';
  public searchText: string = '';
  public nameMapping: string = '';
  public passCode: string = 'out@in';
  constructor(private _companyService: CompanyService) {

  }

  ngOnInit() {
  }
  sheetsView() {
    this.errorInfo = '';
    this.sheetArr = [];
    if (!this.searchText) return window.alert('Please enter subdomain');
    this._companyService.getSheets(this.searchText, this.passCode).subscribe((res) => {
      if (res.sheets) {
        this.sheetArr = res.sheets;
        if (!this.sheetArr.length) {
          this.errorInfo = 'No sheets were generated for this subdomain';
        }
        this.nameMapping = res.nameMapping;
      }
      else if (res.message) {
        return window.alert(res.message);
      }
    });
  }
  resetSheets(appId) {
    this._companyService.resetAppConfig(appId, this.passCode).subscribe((res) => {
      return window.alert('Resetted successfully');
    });
  }
  exportSheet(appId, lead) {
    let data = {
      id: appId,
      offset: new Date().getTimezoneOffset(),
      lead: lead,
      userObj: {
        primaryEmail: 'abhishek.singh@venturepact.com',
        name: 'admin'
      }
    };
    this._companyService.exportToSheetAsync(data).subscribe((res) => {
      if (res == 'syncing')
        return window.alert('Currently we are processing your previous request');
      else
        return window.alert('Processing your request');
    });
  }

  sheetPopup(sheets, open) {
    if (open) jQuery('#sheetModal').modal();
    this.sheetUrlArr = sheets;
  }

}
