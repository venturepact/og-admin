import { PlanService } from './../../../shared/services/plan.service';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { PremadeLayoutManager } from '../../../shared/classes/premade-layout-manager';
declare var window:any;
@Component({
  selector: 'features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent extends PremadeLayoutManager implements OnInit {
  @Input() data:any={}
  @Output() featureUpdates:EventEmitter<any>= new EventEmitter<any>();
  features:any =  [];
  edit_mode=false;
  changedFeatures:any=[];
  loading:Boolean=false;
  errorMessage='';
  componentInfo:any={type:'features'};
  featuresCopy:any =[]
  constructor(public _planService:PlanService) { 
    super();
  }  
  ngOnInit() {
  }
  ngOnChanges(changes:SimpleChanges){
    if(this.data && this.data.features){
      this.features = JSON.parse(JSON.stringify(this.data.features));
      this.featuresCopy = JSON.parse(JSON.stringify(this.features));
      this.componentInfo['featuresCopy']=this.featuresCopy;
      this.edit_mode=false;
    }
  }
  
  pushChanges(features){
    this.changedFeatures = this.removeRepeatEntries(features.unchangedFeatures,features.changedFeatures,this.changedFeatures);
    console.log(this.changedFeatures);
  }
  changeStatus(subFeatures,status){
    subFeatures.forEach((feat)=>{
      // if(feat['active']!=status){
        feat.active = status;      
      // }
    }) 
  }
  updateFeatures(features){
    if(!features.length){
      return;
    }
    this.loading = true;
    
    this._planService.updateFeatures({plan:this.data['plan']['_id'],featuresToUpdate:features,iteratee:'features'})
      .subscribe(data=>{
          this.loading=false;
          if(data && data['features'].length){
            this.featureUpdates.emit(features);            
          }
          window.toastNotification('features Updated');
          this.errorMessage='';
          this.changedFeatures=[];
      },error=>{
        this.loading=false;
        this.restoreState(this.features,features);
        this.errorMessage=error.error.err_message;
        this.changedFeatures=[];
      });
  }
  removeRepeatEntries(unchangedEntries,newEntries,allEntries){
    unchangedEntries.forEach((entry)=>{
      let i = allEntries.findIndex((e)=>e._id===entry._id);
      i!=-1 && allEntries.splice(i,1);
    })
    return [...allEntries,...newEntries];
  }
}
