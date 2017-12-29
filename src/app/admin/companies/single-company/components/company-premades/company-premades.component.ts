import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from '../../../../../shared/services/index';
import { AdminService } from '../../../../../shared/services/admin.service';
declare var jQuery:any;
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
  availableTemplates=[];

  constructor(private companyService:CompanyService,private adminService:AdminService) {
   }

  ngOnInit() {
    this.getAvailableTemplates();

    this.companyService.getCompanyTemplates().subscribe(data=>{
      this.availableTemplates=data;     
      this.disableTemplates(); 
    })
  }
  getCompanyPremades(){
    this.loading=true;
    this.companyService.getCompanyPremades(this.company)
    .subscribe((data)=>{
      this.data = data;
      this.templates.forEach((obj,index)=>{
        this.checkForParentStatus(index,obj.selector);
      })
      this.loading=false;
    })
  }
  ngAfterViewInit(){
    this.getCompanyPremades();    
  }
  updateCompanyPremades(){
    this.companyService.updateCompanyPremades({company:this.company,premades:this.data.premades})
    .subscribe((data)=>{
      this.getCompanyPremades();
      setTimeout(this.disableTemplates.bind(this),500);
    })
  }
  getAvailableTemplates(){
    this.adminService.getAvailableTemplates().subscribe((data)=>{
      this.templates=data;
    }) 
  }

  selectAll(value,selector){
    this.data && this.data.premades.forEach(element => {
        if(element.template == selector)
          element.active = value
    });
  }
  checkForParentStatus(parentIndex,selector){
    let filteredArray = this.data.premades.filter(obj=>{
      return (obj.template == selector);
    });
    if(filteredArray.length == 0){
      this.templates[parentIndex].available=false;
      return;
    }
    let result = filteredArray.every(obj=>{
      return obj.active
    })
    this.templates[parentIndex].available=result;
  }
  disableTemplates(){
    if(this.templates.length > 0){
      this.availableTemplates.forEach((obj)=>{
        let index = this.templates.findIndex(ele=> (ele.name == obj.feature.name));
        if(!obj.active){
          setTimeout(()=> {
            jQuery("#template"+index+" :input").attr("disabled", true);
          }, 500);
        }else{
          jQuery("#template"+index+" :input").attr("disabled", false);
        } 
      })
    }
  }
  
}
