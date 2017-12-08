import {Component, Input, OnInit} from "@angular/core";
import {Script} from "../../../shared/services/script.service";
import {AdminService} from "../../../shared/services/admin.service";
import {PlanService} from "../../../shared/services/plan.service";
import {parseLazyRoute} from "@angular/compiler/src/aot/lazy_routes";

@Component({
  selector: 'edit-hello-bar',
  templateUrl: './edit-hello-bar.component.html',
  styleUrls: ['./edit-hello-bar.component.css'
    , '../../../site/components/+analytics/assets/css/daterangepicker.css'
    , '../../search-calc/search-calc.component.css']
})
export class EditHelloBarComponent implements OnInit {

  @Input()
  selectedHellobar: any;

  plans: Array<String> = [];
  values = {
    plan: this.plans,
    one_click_upgrade_plans: ['freelancer_m', 'freelancer_y', 'essentials_m', 'essentials_y', 'business_m', 'business_y',
      'essentials_y_jv', 'essentials_m_jv'],
    status: ['future', 'in_trial', 'active', 'non_renewing', 'cancelled'],
    payment_info_added: ['valid', 'expiring', 'expired']
  };
  stringOperators: Array<string> = ['equals', 'not equal to'];
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
    logic_gate: ''
  };

  hellobarMessage: string = '';
  ctaText: string = '';
  ctaLink: string = '';
  ctaPlan: string = '';
  stopDate: Date;
  hellobarId: string;

  constructor(private _script: Script, private adminService: AdminService,
              private planService: PlanService) {
  }

  ngOnInit() {
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
          this.plans.push(plan._id);
        }
      });
    });
    if (this.selectedHellobar == null) {
      this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
    }
    else {
      this.hellobarId = this.selectedHellobar._id;
      this.hellobarMessage = this.selectedHellobar.message;
      this.ctaText = this.selectedHellobar.cta.ctaText;
      this.ctaLink = this.selectedHellobar.cta.ctaLink;
      this.ctaPlan = this.selectedHellobar.cta.plan;
      this.stopDate = this.selectedHellobar.stopDate;
      this.conditions = [];
      this.selectedHellobar.conditions.forEach(condition => {
        this.conditions.push({
          attributes: ['plan', 'status', 'payment_due_date', 'signed_up', 'payment_info_added'],
          selected_attribute: condition.attribute,
          selected_operator: condition.operator,
          selected_value: condition.value,
          logic_gate: condition.logicGate
        })
      });
    }
  }

  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }


  saveHellobar(status) {
    console.log(this.conditions);
    this.adminService.saveHellobar({
      _id: this.hellobarId,
      conditions: this.conditions,
      message: this.hellobarMessage,
      stopDate: this.stopDate,
      ctaText: this.ctaText,
      ctaLink: this.ctaLink,
      plan: this.ctaPlan,
      status: status
    }).subscribe(response => {
      this.hellobarId = response._id;
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

}
