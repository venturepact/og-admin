import { PremadeLayoutManager } from './../../../shared/classes/premade-layout-manager';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'feature-layout-manager',
  templateUrl: './feature-layout-manager.component.html',
  styleUrls: ['./feature-layout-manager.component.css']
})
export class FeatureLayoutManagerComponent extends PremadeLayoutManager implements OnInit {
  @Input() features=[];
  @Input() info;
  @Output() changes:EventEmitter<any>=new EventEmitter<any>();
  constructor() {
    super();
   }

  ngOnInit() {
  }
  pushChanges(feature,calc){
    if(feature.parent_feature === 'formula_operators'){
      console.log(feature.active);
    }else{
      this.changes.emit(feature);      
    }
  }
  changeOthers(feat,feature){
    let featIndex = this.features.findIndex(f=>f._id === feature._id);
    if(featIndex!=-1){
      this.features[featIndex].sub_features = feature.sub_features.map(f=>{
        console.log(f._id !== feat._id);
        if(f._id !== feat._id)
            f.active = false;
        else
            f.active= true;
        this.changes.emit(f);
        return f;
      });
      
    }
    
  }
  selectAllCalc(event,feature){
    if(!feature['active']){
      this.popUp();
      event.target.checked=false;
      return;
    }
    feature['sub_features'].forEach((calc)=>{
      if(event.target.checked != calc['active']){
        calc.active=event.target.checked;
        this.changes.emit(calc);
      }
    })
  }
  isAllChildMarked(template){
    if(!template['sub_features'] || !template['sub_features'].length)
      return false;
    return template['sub_features'].every(calc=>calc['active']);
  }
  
}
