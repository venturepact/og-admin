import {Component, Input, OnInit} from '@angular/core';
import {AdminService} from "../../../shared/services/admin.service";

@Component({
  selector: 'og-integration-log-details',
  templateUrl: './integration-log-details.component.html',
  styleUrls: ['./integration-log-details.component.css']
})
export class IntegrationLogDetailsComponent implements OnInit {

  @Input()
  log: any;
  keysGetter = Object.keys;
  logDetails: any;

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
  }

  showModal(integratioName) {
    let data = {};
    this.adminService.getIntegrationLogDetails(data).subscribe(response => {
      this.logDetails = response;
    });
  }

}
