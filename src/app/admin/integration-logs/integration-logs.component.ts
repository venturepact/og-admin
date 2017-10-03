import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Datatable} from "../../shared/interfaces/datatable.interface";
import {Script} from "../../shared/services/script.service";
import {AdminService} from "../../shared/services/admin.service";

@Component({
  selector: 'app-integration-logs',
  templateUrl: './integration-logs.component.html',
  styleUrls: ['./integration-logs.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IntegrationLogsComponent extends Datatable implements OnInit, AfterViewInit {

  loading: boolean = false;
  scriptLoaded: boolean = false;
  integrationLogs: Array<any> = [];

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
        console.log(data);
      })
      .catch((error) => {
        console.log('script load error', error);
      });
    this.getIntegrationLogs();
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

  getIntegrationLogs(): any {
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
    };
  }

}
