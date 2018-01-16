
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
    selectAll(event,temp,premade_calcs){
        if(!temp.active){
          event.preventDefault();
          this.popUp();
          return;
        }
        let value = event.target.checked;
        let template = this.getModifiedTemplateName(temp.feature._id);
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
}
