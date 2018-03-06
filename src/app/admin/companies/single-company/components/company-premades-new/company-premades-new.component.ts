import { CompanyService } from './../../../../../shared/services/company.service';
import { PremadeLayoutManager } from './../../../../../shared/classes/premade-layout-manager';
import { Component, OnInit,Input,SimpleChanges } from '@angular/core';
declare var window:any;
@Component({
  selector: 'company-premades-new',
  templateUrl: './company-premades-new.component.html',
  styleUrls: ['./company-premades-new.component.css']
})
export class CompanyPremadesNewComponent extends PremadeLayoutManager implements OnInit {
  @Input() data:any={}
  constructor(public _companyService:CompanyService) { 
    super();
  }
  premades:any =  [];
  changedFeatures:any=[];
  errorMessage='';
  @Input() templates:any=[];
  loading:Boolean = false;
  edit_mode=false;
  componentInfo={
    type:'premades'
  }
  ngOnInit() {
    this._companyService.getCompanyTemplates()
    .subscribe(changedTemplates =>{
      changedTemplates.forEach((template)=>{
          let tempIndex = this.templates.findIndex(obj=>obj['_id']===template['_id']);
          if(tempIndex!=-1){
            this.templates[tempIndex]['active']=template['active'];
            this.templates[tempIndex]['sub_features'].forEach((calc)=>{
              if(calc['active']!=template['active']){
                calc['active']=template['active'];
                this.pushChanges(calc);
              }
            })
          }
      });
      this.updateCalcs(this.changedFeatures);
    });
  }
  modifyTemplates(templates,premades){
    return templates.map(template=>{
      let temp=this.getModifiedTemplateName(template._id);
      template['sub_features']= premades.filter(calc=>calc['template']==temp);
      return template; 
    })
  }
  ngOnChanges(changes:SimpleChanges){
    console.log(this.data,this.templates);
    if(this.data && this.data.premades){
      this.premades = JSON.parse(JSON.stringify(this.data.premades));
      let templates = JSON.parse(JSON.stringify(this.templates));
      this.templates =this.modifyTemplates(templates,this.premades);
      delete this.premades;
      this.edit_mode=false;
    }
  }

 
  pushChanges(feature){
    // console.log(feature);
    let index = this.changedFeatures.findIndex(obj=>(obj['_id']===feature['_id']));
    (index==-1) && this.changedFeatures.push(feature);
    (index!=-1 && this.changedFeatures[index]['active']==feature['active']) && this.changedFeatures.splice(index,1);
    console.log(this.changedFeatures);
  }
  updateCalcs(features){
    console.log(features);
    if(!features.length){
      return ;
    }
    this.loading= true;
    this._companyService.updateFeatures({plan:this.data['plan'],features,company:this.data['company']},'premades')
    .subscribe((data)=>{
      this.loading= false
      window.toastNotification('Premade Cals Updated');
      this.errorMessage='';
      this.changedFeatures=[];
    },error=>{
      this.loading = false;
      this.restoreState(this.templates,features);
      this.errorMessage=error.error.err_message;
      this.changedFeatures=[];
    })
  }

}
