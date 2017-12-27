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
  premades_calcs=[];
  templates=[];
  constructor(private planService:PlanService,
    private adminService:AdminService) { }

  ngOnInit() {
      this.getAvailableTemplates();
  }
  ngOnChanges(changes:SimpleChanges){
    this.getPlanPremades();
  }
  getPlanPremades(){
    this.loading=true;
    this.planService.getPlanPremades(this.plan._id).subscribe((data)=>{
      this.loading=false;
      this.premades_calcs=data;
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
      this.templates=data;
    }) 
  }

}
