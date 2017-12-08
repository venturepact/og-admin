import { Datatable } from './../../shared/interfaces/datatable.interface';
import { PremadeCalcService } from './../../shared/services/premade-calc.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators,FormBuilder} from '@angular/forms';
declare var jQuery:any;
@Component({
  selector: 'app-premade-calcs',
  templateUrl: './premade-calcs.component.html',
  styleUrls: ['./premade-calcs.component.css']
})
export class PremadeCalcsComponent extends Datatable implements OnInit {
  loading: boolean;
  edit:boolean;
  selectedItem:any;
  calculatorForm: FormGroup;
  calculators:any=[];
  rejectedCalcs:any=[];
  $subscription;
  errorMessage='';
  industries=['Auto','Education','Finance','Health & Fitness'
              ,'Legal','Marketing & Advertising','Publishing'
              ,'Quintessential','Real Estate & Construction','Technology'
              ,'Travel','TV and Entertainment'];
  templates= [
    ['one-page-card-new','Chicago'],
    ['sound-cloud-v3','Londoner'],
    ['template-seven','Seattle'],
    ['inline-temp-new','Greek'],
    ['experian','Tokyo'],
    ['template-five','Madrid'],
    ['template-six','Stockholm']
  ];
  constructor(private _fb:FormBuilder,private _calculatorService:PremadeCalcService) {
    super();
   }

  ngOnInit() {
    this.calculatorForm=this._calculatorService.getForm();
    this.getCalculators();
  }
  getCalculators(){
      this.loading = true;
      let obj = {
        limit: this.current_limit,
        page: this.current_page - 1,
        searchKey: this.search
      };
     this._calculatorService.getCalculators(obj).subscribe((response)=>{
      this.loading=false;
      this.total_pages = Math.ceil(response.count / this.current_limit);
      this.calculators=response.calculators;
      this.errorMessage='';
    },error=>{
      this.loading=false;
      this.errorMessage=error.message;
      console.log("Error: ",error); 
    })
  }
  addCalculator(data){
    let calculatorData=Object.assign(data,this.extractData(data['live_url']));
    if(calculatorData['subdomain'] && calculatorData['calcName']){
      this.requestToAdd([calculatorData]);
      this.errorMessage='';
    }else{
      this.errorMessage='Not Valid urls..';
    }
  }
  updateCalculator(data){

    this.$subscription=this._calculatorService.updateCalculator(Object.assign({},this.selectedItem,data,this.extractData(data['live_url'])))
                        .subscribe((response)=>{
                            console.log("Response",response);
                            if(Object.keys(response).length==0){
                              this.calculatorRejected();
                              return ;                              
                            }
                            else
                              this.calculatorAdded();
                            this.getCalculators();
                        });

  }
  calculatorRejected(){
    this.errorMessage='This calculator does not exists';
    this.calculatorForm.get('live_url').setValue('');
  }
  calculatorAdded(){
    jQuery("#add-calc").modal('hide');
    this.errorMessage='';
  }
  requestToAdd(calculators,multi=false){
    if(calculators.length>0){
      this.$subscription=this._calculatorService.addPremadeCalc(calculators).subscribe((response)=>{
        console.log(response['not_created'])
        let rejects = response['not_created'].map(obj=>{
          return obj['live_url'];
        })
        this.rejectedCalcs=[...this.rejectedCalcs,...rejects];
        if(!multi && rejects.length>0){
          this.calculatorRejected();
          return ;
        }
        if(!multi && response['created'].length==1){
          this.calculatorAdded(); 
          this.rejectedCalcs=[];
        };
        this.calculatorForm.reset();
        this.getCalculators();
      },error=>{
        this.errorMessage=error.error.message;
      })
      this.errorMessage='';
    }else{
      this.errorMessage='There is no calculators to add';
    }
  }
  fileChange(event){
    this.rejectedCalcs=[];
    let files:FileList=event.target.files;
    if(files && files.length > 0) {
      let file : File = files.item(0);
      if(file.type=='text/csv'){
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            let csv: string = reader.result;
            this.csvToCalculators(csv);
        }
        this.errorMessage='';
      }else this.errorMessage='Only Csv files are allowed...';
      
    }else this.errorMessage='No file selected..';

  }
  csvToCalculators(csv){
    let lines=csv.split('\n');
    if(lines.length > 0){
      let calculators= lines.reduce((acc,line)=>{
          let row=line.split(',');
          if(row[1] && !this.testliveUrl(row[1])){
            this.rejectedCalcs.push(row[1]);
            return acc;
          }
          if(!row[1]) return acc; 
          let template=this.getTemplateType(row[4],1);
          let obj={
                title:row[0],
                live_url:row[1],
                media:row[2],
                type:(typeof(row[3]) == 'string' || row[3])?(row[3].trim()?row[3]:'Calculator'):'Calculator',
                template:template,
                industry:(typeof(row[5]) == 'string' || row[5])?(row[5].trim()?row[5]:'Auto'):'Auto',
                tier:(typeof(row[6]) == 'string' || row[6])?(row[6].trim()?row[6]:'standard'):'standard',
                description:row[7]
          };
          obj=Object.assign(obj,this.extractData(obj['live_url']));
          if(obj['subdomain'] && obj['calcName']) acc.push(obj);
          else if(obj && Object.keys(obj).length>1) {
            this.rejectedCalcs.push(row[1]);
          } 
          return acc;
        },[]);
      this.errorMessage='';
      console.log(calculators);
      this.requestToAdd(calculators,true);
    }else{
      this.errorMessage="No data in this file";
    }
  }
  extractData(value){
      if(!value) return {};
      let obj={};
      value=value.replace(/^(http|https|ftp)?(:\/\/)/igm,'');
      let arr=value.split('/');
      obj['calcName']=arr[1];
      obj['subdomain']=arr[0] ? arr[0].split('.')[0]: null;
      return obj;
  }
  testliveUrl(url){
    return (/^(http|https|ftp)?(:\/\/)?([a-zA-Z0-9]+){3,}(\.)(outgrow|rely)(\.)(local|us|co)\/([a-zA-Z0-9_-]+)$/.test(url));
  }
  
  dateFormat(date: any) {
    let d = new Date(date);
    return d.toString().split('GMT')[0];
  }

  paging(num: number) {
    super.paging(num);
    this.getCalculators();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getCalculators();
  }

  previous() {
    super.previous();
    this.getCalculators();
  }

  next() {
    super.next();
    this.getCalculators();
  }

  searchData() {
    super.searchData();
    this.getCalculators();
  }
  removeCalculator(id){
    this._calculatorService.removeCalculator(id).subscribe((data)=>{
      this.getCalculators();
    })
  }
  getTemplateType(name,index){
    if(!name) return this.templates[0][index?0:1];
    let item = this.templates.find((value)=>{
        return value[index]==name;
    })
    return item[index?0:1];
  }
  editCalculator(index){
    console.log(this.calculators[index]);
    this.selectedItem=this.calculators[index];
    this._calculatorService.setForm(this.selectedItem);
    this.edit=true;
    this.errorMessage='';
  }
}
