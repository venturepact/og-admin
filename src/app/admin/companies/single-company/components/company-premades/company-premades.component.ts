import { PremadeLayoutManager } from './../../../../../shared/classes/premade-layout-manager';
import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from '../../../../../shared/services/index';
import { AdminService } from '../../../../../shared/services/admin.service';
declare var jQuery:any;
declare var bootbox:any;
@Component({
  selector: 'company-premades',
  templateUrl: './company-premades.component.html',
  styleUrls: ['./company-premades.component.css']
})
export class CompanyPremadesComponent extends PremadeLayoutManager implements OnInit  {
  @Input() company:any;
  edit_mode:boolean=false;
  loading:boolean=true;
  data:any;
  availableTemplates=[];
  previousTemplates=[];
  constructor(private companyService:CompanyService,private adminService:AdminService) {
    super();
   }

  ngOnInit() {

    this.companyService.getCompanyTemplates().subscribe(data=>{
      this.availableTemplates=data.templates ? JSON.parse(JSON.stringify(data.templates)) : []; 
      if(this.availableTemplates.length>0 && this.data && this.data.premades){
        this.previousTemplates = this.changeStatus(this.availableTemplates,this.data.premades,this.previousTemplates);
        if(data['op']=='UPDATION'){
          this.updateCompanyPremades();
        }
        this.syncCheckBoxes(this.availableTemplates,this.data);
      }    
    })
  }
  ngAfterViewInit(){
    this.getCompanyPremades();    
  }
  getCompanyPremades(){
    this.loading=true;
    this.companyService.getCompanyPremades(this.company)
    .subscribe((data)=>{
      this.data = data;
      this.loading=false;
      if(this.availableTemplates.length>0){
        this.syncCheckBoxes(this.availableTemplates,this.data);
      } 
    })
  }
  updateCompanyPremades(){
    this.companyService.updateCompanyPremades({company:this.company,premades:this.data.premades})
    .subscribe((data)=>{
      this.getCompanyPremades();
    })
  }
}
