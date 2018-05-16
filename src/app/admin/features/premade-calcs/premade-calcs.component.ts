import { Script } from './../../../shared/services/script.service';
import { PremadeCalcsService } from './../services/premade-calcs.service';
import { Datatable } from './../../../shared/interfaces/datatable.interface';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from './../../../shared/services/admin.service';
declare var jQuery: any;
declare var moment: any;
@Component({
  selector: 'premade-calcs',
  templateUrl: './premade-calcs.component.html',
  styleUrls: ['./premade-calcs.component.css',
    './../../../site/components/+analytics/assets/css/daterangepicker.css'],
  encapsulation: ViewEncapsulation.None
})
export class PremadeCalcsComponent extends Datatable implements OnInit {
  loading: boolean;
  edit: boolean;
  selectedItem: any;
  calculatorForm: FormGroup;
  calculators: any = [];
  rejectedCalcs: any = [];
  $subscription;
  errorMessage = '';;
  loader = false;
  mt=moment;
  @ViewChild('fileUpload') fileUpload: any;
  industries = ['Auto', 'Education', 'Finance', 'Health & Fitness'
    , 'Legal', 'Marketing & Advertising', 'Publishing'
    , 'Quintessential', 'Real Estate & Construction', 'Technology'
    , 'Travel', 'TV and Entertainment', 'Trending'];
  templates = [];
  // templates= [
  //   ['one-page-card-new','Chicago'],
  //   ['sound-cloud-v3','Londoner'],
  //   ['template-seven','Seattle'],
  //   ['inline-temp-new','Greek'],
  //   ['experian','Tokyo'],
  //   ['template-five','Madrid'],
  //   ['template-six','Stockholm'],
  //   ['template-eight',]
  // ];
  scriptLoaded = false;
  constructor(private _fb: FormBuilder,
    private _calculatorService: PremadeCalcsService,
    private _adminService: AdminService,
    private _script: Script) {
    super();
  }

  ngOnInit() {

    this.calculatorForm = this._calculatorService.getForm();
    this.getCalculators();
  }
  ngAfterViewInit() {
    this._script.load('daterangepicker')
      .then((data) => {
        console.log(data);
        this.scriptLoaded = true;
      })
  }
  getCalculators() {
    this.loading = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search
    };
    this._calculatorService.getCalculators(obj).subscribe((response) => {
      this.loading = false;
      this.total_pages = Math.ceil(response.count / this.current_limit);
      this.calculators = response.calculators;
      this.errorMessage = '';
      this.templates = this._adminService.availableTemplates;

    }, error => {
      this.loading = false;
      this.errorMessage = error.message;
      console.log("Error: ", error);
    })
  }
  addCalculator(data, btn) {
    let calculatorData = Object.assign(data, this.extractData(data['live_url']));
    if (calculatorData['subdomain'] && calculatorData['calcName']) {
      this.requestToAdd([calculatorData], false, btn);
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Not Valid urls..';
    }
  }
  updateCalculator(data, btnRef) {
    btnRef && this.changeButtonProps(btnRef, { textContent: 'Please wait...', disabled: true });

    this.$subscription = this._calculatorService.updateCalculator(Object.assign({}, this.selectedItem, data, this.extractData(data['live_url'])))
      .subscribe((response) => {
        console.log("Response", response);
        if (Object.keys(response).length == 0) {
          this.calculatorRejected();
          return;
        }
        else
          this.calculatorAdded();
        this.getCalculators();
        btnRef && this.changeButtonProps(btnRef,{textContent:'Update',disabled:false});
    
      },error=>{
        this.errorMessage=error.error.err_message;
        btnRef && this.changeButtonProps(btnRef,{textContent:'Update',disabled:false});
    
      });

  }
  calculatorRejected() {
    this.errorMessage = 'This calculator does not exists';
    this.calculatorForm.get('live_url').setValue('');
  }
  calculatorAdded() {
    jQuery("#add-calc").modal('hide');
    this.errorMessage = '';
  }
  requestToAdd(calculators, multi = false, btnRef: any = '') {
    if (calculators.length > 0) {
      (btnRef) &&
        this.changeButtonProps(btnRef, { textContent: 'Please wait...', disabled: true });
      this.$subscription = this._calculatorService.addPremadeCalc(calculators).subscribe((response) => {
        console.log(response['not_created'])
        let rejects = response['not_created'].map(obj => {
          return obj['live_url'];
        })
        this.rejectedCalcs = [...this.rejectedCalcs, ...rejects];
        if (!multi && rejects.length > 0) {
          this.calculatorRejected();
          return;
        }
        if (!multi && response['created'].length == 1) {
          this.calculatorAdded();
          this.rejectedCalcs = [];
        };
        this.calculatorForm.reset();
        this.getCalculators();
        (btnRef) &&
          this.changeButtonProps(btnRef, { textContent: 'Add' });
      }, error => {
        this.errorMessage = error.error.message;
        this.changeButtonProps(btnRef, { textContent: 'Add' });
      })
      this.errorMessage = '';
    } else {
      this.errorMessage = 'There is no calculators to add';
    }
  }
  changeButtonProps(ref, prop = {}) {
    Object.keys(prop).forEach(key => {
      ref[key] = prop[key];
    })
  }
  fileChange(event) {
    this.rejectedCalcs = [];
    let files: FileList = event.target.files;
    if (files && files.length > 0) {
      let file: File = files.item(0);
      if (file.type == 'text/csv') {
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
          let csv: string = reader.result;
          this.csvToCalculators(csv);
        }
        this.errorMessage = '';
      } else this.errorMessage = 'Only Csv files are allowed...';

    } else this.errorMessage = 'No file selected..';

  }
  csvToCalculators(csv) {
    let lines = csv.split('\n');
    if (lines.length > 0) {
      let calculators = lines.reduce((acc, line) => {
        let row = line.split(',');
        if (row[1] && !this.testliveUrl(row[1])) {
          this.rejectedCalcs.push(row[1]);
          return acc;
        }
        if (!row[1]) return acc;
        let template = this.getTemplateType(row[4], 'name');
        let obj = {
          title: row[0],
          live_url: row[1],
          media: row[2],
          type: (typeof (row[3]) == 'string' || row[3]) ? (row[3].trim() ? row[3] : 'Calculator') : 'Calculator',
          template: template,
          industry: (typeof (row[5]) == 'string' || row[5]) ? (row[5].trim() ? row[5] : 'Auto') : 'Auto',
          tier: (typeof (row[6]) == 'string' || row[6]) ? (row[6].trim() ? row[6] : 'standard') : 'standard',
          description: row[7]
        };
        obj = Object.assign(obj, this.extractData(obj['live_url']));
        if (obj['subdomain'] && obj['calcName']) acc.push(obj);
        else if (obj && Object.keys(obj).length > 1) {
          this.rejectedCalcs.push(row[1]);
        }
        return acc;
      }, []);
      this.errorMessage = '';
      console.log(calculators);
      this.requestToAdd(calculators, true);
    } else {
      this.errorMessage = "No data in this file";
    }
  }
  extractData(value) {
    if (!value) return {};
    let obj = {};
    value = value.replace(/^(http|https|ftp)?(:\/\/)/igm, '');
    let arr = value.split('/');
    obj['calcName'] = arr[1];
    obj['subdomain'] = arr[0] ? arr[0].split('.')[0] : null;
    return obj;
  }
  testliveUrl(url) {
    return (/^(http|https|ftp)?(:\/\/)?([a-zA-Z0-9]+){3,}(\.)(outgrow|rely)(\.)(local|us|co|co.in)\/([a-zA-Z0-9_-]+)$/.test(url));
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
  removeCalculator(id) {
    this._calculatorService.removeCalculator(id).subscribe((data) => {
      this.getCalculators();
    })
  }
  getTemplateType(name, prop) {
    if (!name) return this.templates[0][(prop == 'selector') ? 'name' : 'selector'];
    let item = this.templates.find((value) => {
      if (prop == 'name') {
        return value[prop] == `The ${name}`
      }
      return value[prop] == name;
    })
    return item[(prop == 'selector') ? 'name' : 'selector'];
  }
  editCalculator(index) {
    console.log(this.calculators[index]);
    this.selectedItem = this.calculators[index];
    console.log(this.selectedItem);
    this._calculatorService.setForm(this.selectedItem);
    this.selectedItem['launch_date'] && (jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(moment(this.selectedItem['launch_date']).utc().add(0, 'days').format('MM/DD/YYYY')),
    jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(moment(this.selectedItem['launch_date']).utc().add(0, 'days').format('MM/DD/YYYY')));
    this.selectedItem['launch_date'] || (jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(moment(new Date()).utc().add(0, 'days').format('MM/DD/YYYY')),
    jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(moment(new Date()).utc().add(0, 'days').format('MM/DD/YYYY'))
    );
    
    this.edit = true;
    this.errorMessage = '';
    this.loader = false;
  }
  upload(files: FileList, imgSrc: any) {
    console.log(files);
    let file: File = files.item(0);
    if (file.type.startsWith('image/')) {
      this.loader = true;
      //let reader: FileReader = new FileReader();
      this.uploadImageToServer(file);
      // reader.readAsDataURL(file);
      // reader.onload = (e:any) => {
      //     console.log(e.target.result);
      //     imgSrc.src=e.target.result;

      // }
      // reader.addEventListener('progress',e=>{
      //   if(e.lengthComputable){
      //     console.log(e.loaded);

      //   }
      // },false);
      // this.errorMessage='';
    }
  }
  uploadImageToServer(url) {
    this._adminService.uploadGif(url).subscribe((data) => {
      this.loader = false;
      console.log(data);
      this.calculatorForm.get('media').setValue(data);
    }, error => {
      this.loader = false;
      this.calculatorForm.get('media').setValue('');
      console.log(error.error);
      this.errorMessage = error.error.err_message;
    })
  }
  setLaunchDate(date) {
    console.log(date);
    this.calculatorForm.get('launch_date').setValue(date['start_date']);
  }
}
