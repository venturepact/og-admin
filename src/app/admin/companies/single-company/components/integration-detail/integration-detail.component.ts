import {AfterViewInit, Component, Input} from "@angular/core";
import {AdminService} from "../../../../../shared/services/admin.service";
import {Datatable} from "../../../../../shared/interfaces/datatable.interface";
import {Script} from "../../../../../shared/services/script.service";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'og-integration-detail',
  templateUrl: './integration-detail.component.html',
  styleUrls: ['./integration-detail.component.css', '../membership-detail/membership-details.component.css']
})
export class IntegrationDetailComponent extends Datatable implements AfterViewInit {
  @Input() company: any;
  keysGetter = Object.keys;
  input = new FormControl();
  subscriptions: Subscription = new Subscription();

  integrationConfig: any;
  selectedIntegrationConfig: any = {};

  appConfig: any = {};
  selectedIntegration: any;
  selectedAppIntegrations: any;

  integrationLogs: any = {};
  selectedAppLog: any = {};

  constructor(public _script: Script, public adminService: AdminService) {
    super();
  }

  ngAfterViewInit(): void {
    this._script.load('datatables')
      .then((data) => {
        console.log(data);
      }).catch((error) => {
      console.log('Script not loaded', error);
    });

    this.subscriptions.add(this.input.valueChanges.debounceTime(500).distinctUntilChanged()
      .switchMap(data => {
        super.searchData();
        return this.adminService.getAppIntegrationLogs({company_id: this.company.id, search: this.search});
      })
      .subscribe((response) => {
        this.integrationLogs = response;
      }));
  }

  getIntegrationsConfig() {
    this.adminService.getCompanyIntegrations({company_id: this.company.id}).subscribe(data => {
      this.integrationConfig = data;
    });
  }

  getAppIntegrationsConfig() {
    this.adminService.getAppIntegrations({company_id: this.company.id}).subscribe(data => {
      this.appConfig = data;
    });
  }

  getIntegrationLogs() {
    this.adminService.getAppIntegrationLogs({company_id: this.company.id, search: this.search})
      .subscribe(data => {
      this.integrationLogs = data;
    });
  }

  paging(num: number) {
    super.paging(num);
    this.getIntegrationLogs();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getIntegrationLogs();
  }

  previous() {
    super.previous();
    this.getIntegrationLogs();
  }

  next() {
    super.next();
    this.getIntegrationLogs();
  }
}
