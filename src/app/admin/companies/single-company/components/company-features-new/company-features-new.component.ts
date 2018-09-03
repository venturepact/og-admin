import { CompanyService } from './../../../../../shared/services/company.service';
import { PlanService } from './../../../../../shared/services/plan.service';
import { Component, OnInit,EventEmitter,Input,Output,SimpleChanges } from '@angular/core';
import { PremadeLayoutManager } from '../../../../../shared/classes/premade-layout-manager';
declare var window:any;
@Component({
  selector: 'company-features-new',
  templateUrl: './company-features-new.component.html',
  styleUrls: ['./company-features-new.component.css']
})
export class CompanyFeaturesNewComponent extends PremadeLayoutManager implements OnInit {

  @Input() data:any={}
  @Output() featureUpdates:EventEmitter<any>= new EventEmitter<any>();
  features:any =  [];
  edit_mode=false;
  changedFeatures:any=[];
  loading:Boolean=false;
  errorMessage='';
  componentInfo:any={type:'features'};
  featuresCopy:any =[]
  constructor(public _companyService:CompanyService) { 
    super();
  }  
  ngOnInit() {
  }
  ngOnChanges(changes:SimpleChanges){
    this.loading=true;
    if(this.data && this.data.features){
      this.loading=false;
      // this.data.features =
      this.features = JSON.parse(JSON.stringify(this.data.features));
      this.featuresCopy = JSON.parse(JSON.stringify(this.features));
      this.componentInfo['featuresCopy']=this.featuresCopy;
      this.edit_mode=false;
    }
  }
  
  removeRepeatEntries(unchangedEntries,newEntries,allEntries){
    unchangedEntries.forEach((entry)=>{
      let i = allEntries.findIndex((e)=>e._id===entry._id);
      i!=-1 && allEntries.splice(i,1);
    })
    return [...allEntries,...newEntries];
  }
  pushChanges(features){
    this.changedFeatures = this.removeRepeatEntries(features.unchangedFeatures,features.changedFeatures,this.changedFeatures);
    console.log(this.changedFeatures);
  }
  changeStatus(subFeatures,status){
    subFeatures.forEach((feat)=>{
      feat.active = status;
    }) 
  }
  updateFeatures(features){
    if(!features.length){
      return;
    }
    this.loading = true;
    this._companyService.updateFeatures({plan:this.data['plan'],features,company:this.data['company']},'features')
      .subscribe(data=>{
          this.loading=false;
          if(data && data['features']){
            this.featureUpdates.emit(this.changedFeatures);            
          }
          this.errorMessage='';
          window.toastNotification('Features Updated');
          this.changedFeatures=[];
      },error=>{
        this.loading=false;
        this.restoreState(this.features,features);
        this.errorMessage=error.error.err_message;
        this.changedFeatures=[];
      });
  }

}
