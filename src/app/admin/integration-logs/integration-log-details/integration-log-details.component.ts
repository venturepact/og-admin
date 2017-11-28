import {Component, Input, OnInit} from '@angular/core';
import {AdminService} from "../../../shared/services/admin.service";

declare var jQuery: any;

@Component({
  selector: 'og-integration-log-details',
  templateUrl: './integration-log-details.component.html',
  styleUrls: ['./integration-log-details.component.css']
})
export class IntegrationLogDetailsComponent implements OnInit {

  @Input()
  log: any;
  @Input()
  app: any;
  keysGetter = Object.keys;
  logDetails: any;
  loading: boolean = false;

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
  }

  showModal(integratioName) {
    jQuery("#log-detail").modal('show');
    let data = {integration: integratioName, app: this.log.app._id};
    this.adminService.getIntegrationLogDetails(data).subscribe(response => {
      this.logDetails = response;
    });
  }

}
