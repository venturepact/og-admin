import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from '../../../../../shared/services/index';
import { AdminService } from '../../../../../shared/services/admin.service';

@Component({
  selector: 'company-premades',
  templateUrl: './company-premades.component.html',
  styleUrls: ['./company-premades.component.css']
})
export class CompanyPremadesComponent implements OnInit {
  @Input() company:any;
  edit_mode:boolean=false;
  loading:boolean=true;
  data:any;
  templates=[];
  constructor(private companyService:CompanyService,private adminService:AdminService) {
   }

  ngOnInit() {
    this.getAvailableTemplates();
  }
  getCompanyPremades(){
    this.loading=true;
    this.companyService.getCompanyPremades(this.company)
    .subscribe((data)=>{
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data);
      this.data = data;
      this.loading=false;
    })
  }
  ngAfterViewInit(){
    this.getCompanyPremades();    
  }
  updateCompanyPremades(){
    console.log(">>>>>>>>>>>>>>>>>",this.data);
    this.companyService.updateCompanyPremades({company:this.company,premades:this.data.premades})
    .subscribe((data)=>{
      console.log(">>>>>>>>>>>>>>>>>>>",data);
      this.getCompanyPremades();
    })
  }
  getAvailableTemplates(){
    this.adminService.getAvailableTemplates().subscribe((data)=>{
      this.templates=data;
    }) 
  }

}
