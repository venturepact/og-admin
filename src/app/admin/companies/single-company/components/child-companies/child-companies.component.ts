import {Component, Input, OnInit} from '@angular/core';
import {AdminService} from '../../../../../shared/services/admin.service';
import {Router} from "@angular/router";

declare var jQuery;
declare var window;

@Component({
  selector: 'child-companies',
  templateUrl: './child-companies.component.html',
  styleUrls: ['./child-companies.component.css', './../../../../../../assets/css/sahil-hover.css',
    './../../../../../../assets/css/custom-material.css']
})

export class ChildCompaniesComponent implements OnInit {
  @Input() companyId: string;
  childCompanies: any = [];

  constructor(private _adminService: AdminService, private router: Router) {
  }

  ngOnInit(): void {
    this.getChildCompanies();
  }

  getChildCompanies() {
    let self = this;
    self.childCompanies = [];
    let getChildCompanies = self._adminService.getChildCompanies(self.companyId)
      .subscribe(
        (success: any) => {
          self.childCompanies = success;
          getChildCompanies.unsubscribe();
        },
        (error: any) => {
          getChildCompanies.unsubscribe();
        }
      );
  }

  navigateToCompany(companyId) {
    this.router.navigate(['/admin/company', companyId]);
    window.location.reload();
  }
}
