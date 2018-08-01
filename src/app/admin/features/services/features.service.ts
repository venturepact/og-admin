import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/index';
import { Http } from '@angular/http';
import { Validators, FormBuilder,FormGroup } from '@angular/forms';
@Injectable()
export class FeaturesService extends BaseService{
  private featureForm:FormGroup;
  constructor(public _http: Http,private _fb:FormBuilder) { 
    super();
  }
  getForm(){
    this.featureForm=this._fb.group(this.getFormFields());
    return this.featureForm;
  }
  getFormFields(){
      return {
          _id:['',Validators.required],
          name:['',Validators.compose([Validators.required])],
          media_type:[''],            
          media_link:[''],
          description:[''],
          heading:[''],
          parent_feature:[null]
        }
  }
  getFeatures(data){
    return this._http.post(this._url+'/admin/getFeatures',data,this.post_options())
           .map(this.extractData)
           .catch(this.handleError);
  }
  setForm(obj:any){
    this.featureForm.get('_id').setValue(obj._id);
    this.featureForm.get('name').setValue(obj.name);
    this.featureForm.get('media_type').setValue(obj.media_type);
    this.featureForm.get('media_link').setValue(obj.media_link);
    this.featureForm.get('heading').setValue(obj.heading);
    this.featureForm.get('parent_feature').setValue(obj.parent_feature);
    this.featureForm.get('description').setValue(obj.description);
  }
  addFeatures(data){
    return this._http.post(`${this._url}/admin/addFeatures`,data,this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  removeFeature(feature){
    return this._http.delete(`${this._url}/admin/removeFeature/${feature}`,this.delete_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  updateFeature(data){
    return this._http.put(`${this._url}/admin/updateFeature`,data,this.putOptions())
      .map(this.extractData)
      .catch(this.handleError)
  }
  fileReader(event){
    return Observable.create(function(observer){
      let files:FileList=event.target.files;
      if(files && files.length > 0) {
        let file : File = files.item(0);
        if(file.type=='text/csv'){
          let reader: FileReader = new FileReader();
          reader.readAsText(file);
          reader.onload = (e) => {
              let csv: string = reader.result;
              observer.next(csv);
          }
          this.errorMessage='';
        }else observer.error('Only Csv files are allowed...');
        
      }else observer.error('No file selected..');
    });
    
  }
  syncFeatures(data,api){
    return this._http.post(`${api}/admin/addFeatures`,data,this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
}
