import { Script } from './../../../../../shared/services/script.service';
import { AdminService } from './../../../../../shared/services/admin.service';
import { Component, OnInit } from '@angular/core';
import { Datatable } from '../../../../../shared/interfaces/datatable.interface';
import { environment } from '../../../../../../environments/environment';
declare var moment: any;
declare var jQuery: any;

@Component({
  selector: 'datewise-premades',
  templateUrl: './datewise-premade.component.html',
  styleUrls: ['./datewise-premade.component.css', './../../../../../site/components/+analytics/assets/css/daterangepicker.css']
})
export class DatewisePremadeComponent extends Datatable implements OnInit {
  loading: boolean = true;
  mt = moment;
  templates = [];
  
  constructor(public _adminService: AdminService,public _script:Script) {
    super();
  }
  premades = [];
  selected = {};
  ngOnInit() {
    let selectedDate = {
      startDate: moment(new Date()).format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD')
    }
    this.getPremades(selectedDate);
    this._script.load('data_picker_demo').then((script)=>{
      console.log(script);
      const obj = {
        'startDate': moment(new Date()).subtract(0, 'days').format('MM/DD/YYYY'),
        'endDate': moment(new Date()).format('MM/DD/YYYY'),
        'opens': 'left',
        'drops': 'down',
        'autoApply': true,
      };
      jQuery(`#date_picker_premade`).daterangepicker(obj, (start, end, label) => {
          let obj= {
            startDate: start.format('YYYY-MM-DD'),
            endDate : end.format('YYYY-MM-DD')
        };
        console.log(obj);
        this.getPremades(obj);
      });
    })
    
  }
  ngAfterViewInit(){

    
  }
  getPremades(selectedDate) {
    this.loading = true;
    this.premades=[];
    this._adminService.getPremadesDateWise(selectedDate).subscribe((data) => {
      console.log(data, ">>>>>>>>");
      this.premades = data;
      this.loading = false;
      this.templates = this._adminService.availableTemplates;
    }, error => {
      this.loading = false;
    })


  }
  setSelectUrl(premade) {
    this.selected = premade;
  }
  getLink(sub_domain, url) {
    return `${environment.PROTOCOL}${sub_domain}.${environment.LIVE_EXTENSION}/${url}`;
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
}
