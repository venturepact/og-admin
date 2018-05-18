import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from "@angular/core";
import {Script} from "../../../shared/services/script.service";
import {AdminService} from "../../../shared/services/admin.service";
import {PlanService} from "../../../shared/services/plan.service";
import {CompanyService} from "../../../shared/services/company.service";
import {parseLazyRoute} from "@angular/compiler/src/aot/lazy_routes";
declare var moment: any;
declare var jQuery: any;
@Component({
  selector: 'edit-hello-bar',
  templateUrl: './edit-hello-bar.component.html',
  styleUrls: ['./edit-hello-bar.component.css'
    , '../../../site/components/+analytics/assets/css/daterangepicker.css'
    , '../../search-calc/search-calc.component.css']
})
export class EditHelloBarComponent implements OnInit, AfterViewInit {

  @Input() selectedHellobar: any;
  allcompanies: any = [];
  @Output() gotoDashboard: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  today: Date;
  plans: Array<String> = [];
  values = {
    plan: this.plans,
    one_click_upgrade_plans: ['freelancer_m', 'freelancer_y', 'essentials_m', 'essentials_y', 'business_m', 'business_y',
      'essentials_y_jv', 'essentials_m_jv'],
    status: ['future', 'in_trial', 'active', 'non_renewing', 'cancelled'],
    payment_info_added: ['no_card','valid', 'expiring', 'expired']
  };
  stringOperators: Array<string> = ['equals', 'contains', 'not equal to'];
  numberOperators: Array<string> = ['less than', 'greater than', 'equals'];
  operators = {
    plan: this.stringOperators, signed_up: this.numberOperators,
    status: this.stringOperators, payment_due_date: this.numberOperators,
    payment_info_added: this.stringOperators
  };
  conditions: Array<any> = [];
  condition: any = {
    attributes: ['plan', 'status', 'payment_due_date', 'signed_up', 'payment_info_added'],
    selected_attribute: '',
    selected_operator: '',
    selected_value: '',
    logic_gate: 'and'
  };

  hellobarMessage: string = '';
  ctaText: string = '';
  ctaLink: string = '';
  ctaPlan: string = '';
  stopDate: Date;
  hellobarId: string;
  priority: number = 10;
  tickerDate: Date;
  ticker: string = 'no_ticker';
  disardedCompanies: any = [];
  constructor(private _script: Script, private adminService: AdminService,
              private planService: PlanService,
              private companyService: CompanyService) {
                this.disardedCompanies = [];
  }

  ngOnInit() {
    let self= this;
    this.today = moment(new Date).format('YYYY-MM-DD');
    this.planService.getPlanTypes().subscribe(data => {
      data.default.forEach(plan => {
        this.plans.push(plan._id + '_y');
        this.plans.push(plan._id + '_m');
      });
      data.special.forEach(plan => {
        if (plan._id === 'appsumo') {
          this.plans.push('appsumo_d');
        } else if (plan._id === 'appsumoblack') {
          this.plans.push('appsumo_d_black');
        } else if (plan._id === 'webmaster') {
          this.plans.push('webmaster_d');
        } else if (plan._id === 'dealfuel') {
          this.plans.push('dealfuel_d');
        } else {
          this.plans.push(plan._id + '_d');
        }
      });
    });
    if (this.selectedHellobar == null) {
      this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
      console.log('this.conditions', this.conditions);
    }
    else {
      this.hellobarId = this.selectedHellobar._id;
      this.hellobarMessage = this.selectedHellobar.message;
      this.ctaText = this.selectedHellobar.cta.ctaText;
      this.ctaLink = this.selectedHellobar.cta.ctaLink;
      this.ctaPlan = this.selectedHellobar.cta.plan;
      this.stopDate = this.selectedHellobar.stopDate;
      this.tickerDate = this.selectedHellobar.ticker_date;
      this.priority = this.selectedHellobar.priority;
      this.ticker = this.selectedHellobar.ticker;
      this.conditions = [];
      this.selectedHellobar.conditions.forEach(condition => {
        this.conditions.push({
          attributes: ['plan', 'status', 'payment_due_date', 'signed_up', 'payment_info_added'],
          selected_attribute: condition.attribute,
          selected_operator: condition.operator,
          selected_value: condition.value.split(','),
          logic_gate: condition.logicGate
        });
      });
      let getcompanies = setInterval(() => {
        if(self.allcompanies.length){
          let result = self.allcompanies.filter((company) => {
            if(!this.selectedHellobar.not_to_show.includes(company.id))
              return company;
            else
              self.disardedCompanies.push(company);
          });
          self.allcompanies = result;
          clearInterval(getcompanies);
        }
      }, 500);
    }
    this.getAllCompanies();
  }
  
  ngAfterViewInit() {
  }

  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }


  saveHellobar(status, button) {
    button.innerHTML = 'Saving...';
    this.adminService.saveHellobar({
      _id: this.hellobarId,
      conditions: this.conditions,
      message: this.hellobarMessage,
      stopDate: this.stopDate,
      ticker_date: this.tickerDate,
      priority: this.priority,
      ticker: this.ticker,
      ctaText: this.ctaText,
      ctaLink: this.ctaLink,
      plan: this.ctaPlan,
      status: status,
      not_to_show: this.disardedCompanies.map((item, index) => {
        return item.id;
      })
    }).subscribe(response => {
      this.hellobarId = response._id;
      button.innerHTML = 'Save' + status;
      this.gotoDashboard.emit(true);
    });
  }

  setDateCondition(condition, event) {
    console.log(condition, event)
    condition.selected_value = event.start_date
  }

  reset() {
    this.conditions = [];
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  addToDiscard() {
    let self = this;
    let selected = jQuery('#companylists').val();
    if(selected) {
      let result = self.allcompanies.filter((company) => {
        if(!selected.includes(company.id))
          return company;
        else
          self.disardedCompanies.push(company);
      });
      self.allcompanies = result;
    }
  }

  removeToDiscard() {
    let self = this;
    let selected = jQuery('#discardcompanylists').val();
    if(selected) {
      let result = self.disardedCompanies.filter((company) => {
        if(!selected.includes(company.id))
          return company;
        else
          self.allcompanies.push(company);
      });
      self.disardedCompanies = result;
    }
  }

  getAllCompanies() {
    let obj = {
      limit: 25,
      page: 0,
      searchKey: '',
      companyType: 'all'
    };
    let searchkey = jQuery('#searchCompany').val();
    jQuery('#searchcmp').attr('disabled', true);
    jQuery('#searchcmp').html('<i class="fa fa-spinner fa-spin"></i>');
    if(searchkey)
      obj.searchKey = searchkey;
    else
      obj.searchKey = '';
    this.companyService.getAllCompanies(obj)
      .subscribe(
        (response: any) => {
          this.allcompanies = response.companies.map((item, index) => {
            return {id: item._id, name: item.name, sub_domain: item.sub_domain}
          });
          jQuery('#searchcmp').attr('disabled', false);
          jQuery('#searchcmp').html('Search');
        }, (error) => {
          console.error(' error in fetching companies', error);
          jQuery('#searchcmp').attr('disabled', false);
          jQuery('#searchcmp').html('Search');
      });
  }

}
