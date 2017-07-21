import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AdminService} from '../../../../../shared/services/admin.service';
declare var jQuery;
declare var window;
@Component({
	selector: 'child-companies',
	templateUrl: './child-companies.component.html',
	styleUrls: ['./child-companies.component.css', './../../../../../../assets/css/sahil-hover.css','./../../../../../../assets/css/custom-material.css']
})

export class ChildCompaniesComponent implements OnInit{
  @Input() companyId:string;
  childCompanies:any = [];
	constructor(public _router : Router,
              public _adminService: AdminService){
	}
  ngOnInit(): void {
	  console.log('companyIdcompanyId',this.companyId);
	  this.getChildCompanies();
  }

  getChildCompanies(){
	  let self = this;
	  self.childCompanies = [];
	  let getChildCompanies = self._adminService.getChildCompanies(self.companyId)
      .subscribe(
        (success:any) =>{
          self.childCompanies = success;
          getChildCompanies.unsubscribe();
        },
        (error:any) =>{
          getChildCompanies.unsubscribe();
        }
      );
  }
}
