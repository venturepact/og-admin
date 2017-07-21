import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import {FormGroup, FormBuilder ,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService} from './../../shared/services/admin.service';
declare var jQuery: any;
declare var window: any;
@Component({
  selector: 'og-all-features',
  templateUrl: './allFeatures.component.html',
  styleUrls: ['./allFeatures.component.css'],
   encapsulation: ViewEncapsulation.None
})

export class AllFeaturesComponent implements OnInit{
  constructor(
  		public router: Router,
  		public _adminService: AdminService,
  		public fb: FormBuilder
  		){
  }
  features = [];
  edit_mode:boolean = false;
  loading:boolean = true;
  featureId = '';
  featureModel = {
  	 	  id : '',
       name : '',
       heading : '',
       description : '',
       media_type: '',
       media_link: ''
  };
  featureAccessForm : FormGroup ;

  ngOnInit(){
  	 	this.featureAccessForm = this.fb.group({
           _id : '',
           name : ['', Validators.compose([Validators.required])],
           heading : '',
           description : ['', Validators.compose([Validators.required])],
           media_type: '',
           media_link: ''
        });
  	this._adminService.getAllFeatures()
  	.subscribe((response)=>{
  		this.loading = false;
  		this.features = response;
  	})
  }

  openModal(fId, sId=null){
    let featureObj;
    featureObj = this.features.find(x => x._id === fId);
    if(sId) {
      featureObj = featureObj.sub_features.find(x => x._id === sId);
    }
    // console.log(featureObj);
  	if(featureObj){
  		this.featureModel.id = featureObj._id ? featureObj._id : '';
  		this.featureModel.description =  featureObj.description ? featureObj.description : '';
  		this.featureModel.name = featureObj.name ? featureObj.name : '';
  		this.featureModel.heading = featureObj.heading ? featureObj.heading  :  '';
      this.featureModel.media_link = featureObj.media_link ? featureObj.media_link  :  '';
      this.featureModel.media_type = featureObj.media_type ? featureObj.media_type : '';
  	}
  	jQuery('.features-modal').modal('show');
  }

  saveFeatures(event){
  	//this.changeFeature(this.featureAccessForm.value, this.featureModel.id);
  	this.featureAccessForm.value._id = this.featureModel.id;
  	this._adminService.featureUpdate(this.featureAccessForm.value)
  	.subscribe((response)=>{
		  window.toastNotification('Feature is updated Successfully');
  		this.changeFeature(this.featureAccessForm.value, this.featureModel.id);
  		jQuery('.features-modal').modal('hide');
  	},
  	(error)=>{
  		window.toastNotification('Server Error'+error);
  		jQuery('.features-modal').modal('show');
  	})
  }

  changeFeature(feature, id){
  let featureObj = this.features.find(x => x._id === id);
  if(!featureObj) {
      featureObj = this.features.find(x => x.sub_features.find(s => s._id === id));
      featureObj = featureObj.sub_features.find(x => x._id === id);
  }
	featureObj.description =  feature.description;
	featureObj.active =  feature.active;
	featureObj.name = feature.name;
	featureObj.heading = feature.heading;
  featureObj.media_link = feature.media_link;
  featureObj.media_type = feature.media_type;
  }
}
