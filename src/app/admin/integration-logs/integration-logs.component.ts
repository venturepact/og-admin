import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Datatable} from "../../shared/interfaces/datatable.interface";
import {Script} from "../../shared/services/script.service";
import {AdminService} from "../../shared/services/admin.service";

@Component({
  selector: 'app-integration-logs',
  templateUrl: './integration-logs.component.html',
  styleUrls: ['./integration-logs.component.css', './../ionicons.min.css', './../ionicons.min.css', './../../../assets/css/sahil-hover.css', './../../../assets/css/custom-material.css']
})
export class IntegrationLogsComponent extends Datatable implements OnInit, AfterViewInit {

  loading: boolean = false;
  scriptLoaded: boolean = false;
  integrationLogs: Array<any> = [];
  calcName: String;
  companyName: String;
  selectedIntegration: String;
  configuration: string = '';
  keysGetter: any = Object.keys;

  integrations: any = {
    SALESFORCE: 'salesforce',
    SLACK: 'slack',
    MARKETO: 'marketo',
    MAILCHIMP: 'mailchimp',
    GET_RESPONSE: 'getresponse',
    ACTIVE_CAMPAIGN: 'active_campaign',
    AWEBER: 'aweber',
    HUBSPOT: 'hubspot',
    EMMA: 'emma',
    DRIP: 'drip',
    PARDOT: 'pardot',
    CAMPAIGNMONITOR: 'campaignmonitor',
    INTERCOM: 'intercom',
    SENDLANE: 'sendlane'
  };

  constructor(private scriptService: Script, private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit(): void {
    this.scriptService.load('datatables')
      .then((data) => {
        this.scriptLoaded = true;
      })
      .catch((error) => {
        console.log('script load error', error);
      });
    this.getIntegrationLogs();
  }

  resetFilters() {
    this.calcName = '';
    this.companyName = '';
    this.selectedIntegration = '';
    this.configuration = '';
  }

  showDetails(integrationLog) {
    integrationLog.showDetails = !integrationLog.showDetails;
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

  getIntegrationLogs() {
    this.loading = true;
    this.adminService.getAllIntegrationLogs(this.getParams()).subscribe((response: any) => {
      this.integrationLogs = response.logs;
      this.total_pages = Math.ceil(response.count / this.current_limit);
      this.loading = false;
    }, err => {
      this.loading = false
    });
  }

  getParams(): any {
    return {
      limit: this.current_limit,
      page: this.current_page - 1,
      filter: {
        app: this.calcName,
        company: this.companyName,
        configuration: this.configuration,
        integration: this.selectedIntegration
      }
    };
  }

}
