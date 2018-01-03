import { Observable } from 'rxjs/Observable';
import { AdminService } from './../../../shared/services/admin.service';
import { PlanService } from './../../../shared/services/plan.service';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
declare var jQuery:any;
declare var window:any;
@Component({
  selector: 'premade-calcs',
  templateUrl: './premade-calcs.component.html',
  styleUrls: ['./premade-calcs.component.css']
  // encapsulation:ViewEncapsulation.Emulated
})
export class PremadeCalcsComponent implements OnInit {
  @Input() data:any;
  loading:Boolean=true;
  premades_calcs:any=[];
  templates=[];
  constructor(private planService:PlanService,
    private adminService:AdminService) { }

  ngOnInit() { }
  ngOnChanges(changes:SimpleChanges){ 
    (this.data && this.data.plan) && this.getPlanPremades();
  }
  getPlanPremades(){
    this.loading=true;
    this.planService.getPlanPremades(this.data.plan._id).subscribe((data)=>{
      this.loading=false;
      this.premades_calcs=data;
      this.getAvailableTemplates();
    });
  }
  updateCalcs(){
    this.planService.updatePlanPremades({data:this.premades_calcs}).subscribe((data)=>{
      window.toastNotification('Premade Cals Updated');
      this.getPlanPremades();
    })
  }
  getAvailableTemplates(){
    this.templates=this.adminService.availableTemplates;
    this.templates.forEach((obj,index)=>{
      this.checkForParentStatus(index,obj.selector);
    })
    if(this.data.features){
      let item = this.data.features.find(obj => (obj.feature._id == 'templates'));
      this.disableTemplates(item.sub_features,this.templates);
    }
  }
  checkForParentStatus(parentIndex,selector){
    let filteredArray = this.premades_calcs.premades.filter(obj=>{
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
  selectAll(value,selector){
    this.premades_calcs && this.premades_calcs.premades.forEach(element => {
        if(element.template == selector)
          element.active = value
    });
  }
  disableTemplates(availableTemplates,actualTemplates){
    if(actualTemplates.length > 0){
      availableTemplates.forEach((obj)=>{
        let index = actualTemplates.findIndex(ele=> (ele.name == obj.feature.name));
        if(!obj.active){
          setTimeout(()=> {
            jQuery("#template"+index+" :input").attr("disabled", true);
            jQuery('#disable'+index).show();
          }, 500);
        }else{
          jQuery("#template"+index+" :input").attr("disabled", false);
          jQuery('#disable'+index).hide();
        } 
      })
    }
  }
}
