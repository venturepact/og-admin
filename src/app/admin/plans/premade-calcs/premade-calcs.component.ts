import { Observable } from 'rxjs/Observable';
import { AdminService } from './../../../shared/services/admin.service';
import { PlanService } from './../../../shared/services/plan.service';
import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import { Input } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'premade-calcs',
  templateUrl: './premade-calcs.component.html',
  styleUrls: ['./premade-calcs.component.css']
  // encapsulation:ViewEncapsulation.Emulated
})
export class PremadeCalcsComponent implements OnInit {
  @Input() plan:any;
  loading:Boolean=true;
  premades_calcs:any=[];
  templates=[];
  constructor(private planService:PlanService,
    private adminService:AdminService) { }

  ngOnInit() { }
  ngOnChanges(changes:SimpleChanges){ 
    this.getPlanPremades();
  }
  getPlanPremades(){
    this.loading=true;
    this.planService.getPlanPremades(this.plan._id).subscribe((data)=>{
      this.loading=false;
      this.premades_calcs=data;
      this.getAvailableTemplates();
    });
  }
  updateCalcs(){
    this.planService.updatePlanPremades({data:this.premades_calcs}).subscribe((data)=>{
      console.log(data);
      this.getPlanPremades();
    })
  }
  getAvailableTemplates(){
    this.adminService.getAvailableTemplates().subscribe((data)=>{
      console.log("getPremades",data);
      this.templates=data;
      this.templates.forEach((obj,index)=>{
        this.checkForParentStatus(index,obj.selector);
      })
    }) 
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
}
