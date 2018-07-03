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
  featuresCopy:any =[];
  constructor() {
    super();
   }

  ngOnInit() {
  }
  ngOnChanges(){
    if(this.info.type!=='premades'){
      this.featuresCopy = this.info.featuresCopy;      
    }
  }
  pushChanges(feature,calc){
    if(feature.parent_feature === 'formula_operators'){
      console.log(feature.active);
    }else if(this.info['type']!=='premades'){
      let features = this.getDiff(feature,this.featuresCopy);
      console.log(features);      
      this.changes.emit(features);      
    }else{
      this.changes.emit(feature);
    }
  }
  changeOthers(feat,feature){
    let ops={changedFeatures:[],unchangedFeatures:[]}
    let featIndex = this.features.findIndex(f=>f._id === feature._id);
    if(featIndex!=-1){
      this.features[featIndex].sub_features = feature.sub_features.map((f,index)=>{
        (f._id !== feat._id) && (f.active = false);
        (f._id !== feat._id) || (f.active= true);
        ops.changedFeatures.push(f);
        ops.unchangedFeatures.push(f);
        return f;
      });
      console.log(ops);      
      this.changes.emit(ops);
      
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
  getDiff(feature,features){
    let _id = feature['parent_feature'] || feature['_id'];
    let prevParentFeatureState = this.getFeature(_id,this.featuresCopy); 
    return this.getDiffUtil(prevParentFeatureState,feature);
  }
  getDiffUtil(prevFeature,feature){
    let changedFeatures = [];
    let unchangedFeatures = [];
    if(feature['parent_feature']){
      let feat = this.getFeature(feature['_id'],prevFeature['sub_features']);
      this.isFeatureChanged(feat['active'],feature['active']) && changedFeatures.push(feature); 
      this.isFeatureChanged(feat['active'],feature['active']) || unchangedFeatures.push(feature); 
      
    }else{
      this.isFeatureChanged(prevFeature['active'],feature['active']) && changedFeatures.push(feature);
      this.isFeatureChanged(prevFeature['active'],feature['active']) || unchangedFeatures.push(feature);      
      feature.sub_features.forEach((f,index)=>{
        if(this.isFeatureChanged(prevFeature['sub_features'][index]['active'],feature['active'])){
          changedFeatures.push(f);
          f['active']=feature['active'];
        }else{
          f['active']=prevFeature['sub_features'][index]['active'];
          unchangedFeatures.push(f);
        }
                
      });
    }
    return {changedFeatures,unchangedFeatures};
  }
  isFeatureChanged(prevState,newState){
    return (prevState!==newState)
  }
  getFeature(_id,features){
    return features.find(f=>f._id===_id);
  }
  
}
