declare var jQuery:any;
declare var bootbox:any;
export class PremadeLayoutManager {
    syncCheckBoxes(templates,premade_calcs){
        templates.forEach((obj,index)=>{
          if(templates[index].feature.active)
           templates[index].feature.visibility=this.checkForParentStatus(obj.feature._id,premade_calcs.premades);
        }) 
    }
    syncSingleCheckBox(event,template,premade_calcs,calc={}){
        if(!template.active){
          this.popUp();
          event.preventDefault();
          return ;
        }
        template.feature.visibility = this.checkForParentStatus(template.feature._id,premade_calcs,calc);
    }
    getModifiedTemplateName(selector){
        let template = selector.replace(/_/g,'-');
        if((/one-page-card/.test(template) || /sound-cloud/.test(template) || /inline-temp/.test(template))){
          let arr = template.split('-');
          arr.push((template == 'sound-cloud')?'v3':'new');
          template=arr.join('-');
        }
        return template;
    }
    getModifiedTemplateId(selector){
      let template = selector.replace(/-/g,'_');
      if((/one_page_card/.test(template) || /sound_cloud/.test(template) || /inline_temp/.test(template))){
        let arr = template.split('_');
        (arr[arr.length-1]=='v3' || arr[arr.length-1] === 'new')  && arr.pop();
        template=arr.join('_');
      }
      return template;
    }
    selectAll(event,temp,premade_calcs){
        if(!temp.active){
          event.preventDefault();
          this.popUp();
          return;
        }
        let value = event.target.checked;
        let template = this.getModifiedTemplateName(temp._id);
        premade_calcs && premade_calcs.forEach((element,index) => {
            if(element.template == template){
              element.active = value;          
            }
        });
      }
      
      checkForParentStatus(selector,premade_calcs,calc:any={}){
        let template = this.getModifiedTemplateName(selector)
        let filteredArray = premade_calcs.filter(obj=>{
          return (obj.template == template);
        });
        if(filteredArray.length == 0){
          return false;
        }
        if(typeof calc.active != 'undefined'){
          calc.active = !calc.active;
        }
        let result = filteredArray.every(obj=>{
          return obj.active;
        })
        return result;
      }
      popUp(){
        bootbox.dialog({
          closeButton: false,
          message: `<button type="button" class="bootbox-close-button close" data-dismiss="modal"
                                 aria-hidden="true" style="margin-top: -10px;">
                                 <i class="material-icons">close</i></button>
                              <div class="bootbox-body-left">
                                    <div class="mat-icon">
                                      <i class="material-icons">error</i>
                                    </div>
                                </div>
                                <div class="bootbox-body-right">
                                  <p>This layout is locked for user. Unlock the layout first to grant access to the pre made template</p>
                                </div>
                    `,
          buttons: {
            success: {
              label: "OK",
              className: "btn btn-ok btn-hover",
              callback: function () {
              }
            }
          }
        });    
    }
    changeStatus(templates,calcs,previous){
      templates.forEach((element,index) => {
        if((previous.length > 0) && (previous[index].active != element.active)){
            calcs = this.setCalculatorStatus(element.feature._id,calcs,element.active)     
        }
      });
      return JSON.parse(JSON.stringify(templates));;
    }
    setCalculatorStatus(selector,calcs,status){
        console.log(selector,status);
        let template = this.getModifiedTemplateName(selector);
        calcs.forEach((obj)=>{
          if(template == obj.template){
            obj.active=status;
          }
        })
        return calcs;
    }

  expand(target) {
    if(target.classList.contains('glyphicon-plus')) {
      target.classList.remove('glyphicon-plus');
      target.classList.add('glyphicon-minus');
    } else {
      target.classList.remove('glyphicon-minus');
      target.classList.add('glyphicon-plus');
    }
  }
  haveChild(template,premades){
    if(premades.length > 0){
      return premades.some((obj)=>{
        return (template === obj.template)
      })
    }else{
      return true;
    }
  }
  restoreState(features,changes){
    changes.forEach((obj)=>{
      let i=-1;
      if(obj['parent_feature'] || obj['template']){
        let parent = this.search(features,obj['parent_feature'] || this.getModifiedTemplateId(obj['template']));
        parent!=-1 && (i=this.search(features[parent]['sub_features'],obj['_id']));
        (i!=-1) && (features[parent]['sub_features'][i]['active']=!obj['active']);
      }else{
        i=this.search(features,obj['_id']);
        (i!=-1) && (features[i]['active']=!obj['active']);
      }
    })
  }
  search(features,feature){
    return features.findIndex(obj=>{
      return obj['_id']==feature;
    });
  }
  isChecked(template,premades){
    let filtered = premades.filter(obj=>obj['template']==template);
    if(filtered.length){
      return filtered.every(obj=>obj['active']);
    }else{
      return false;
    }
  }
  syncChanges(template,premades){
    jQuery(template).prop('checked',this.isChecked(template,premades));
    //this.isChecked(template,premades);
  }
  // changeCalcStatus(premades,status,template){
  //   this.setCalculatorStatus(template,premades,status);
  // }
}
