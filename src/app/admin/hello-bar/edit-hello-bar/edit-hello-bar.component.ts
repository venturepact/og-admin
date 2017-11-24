import {Component, OnInit} from "@angular/core";
import {Script} from "../../../shared/services/script.service";
import {AdminService} from "../../../shared/services/admin.service";
import {PlanService} from "../../../shared/services/plan.service";

@Component({
  selector: 'edit-hello-bar',
  templateUrl: './edit-hello-bar.component.html',
  styleUrls: ['./edit-hello-bar.component.css'
    , '../../../site/components/+analytics/assets/css/daterangepicker.css'
    , '../../search-calc/search-calc.component.css']
})
export class EditHelloBarComponent implements OnInit {
  scriptLoaded: boolean = false;
  plans: Array<String> = [];

  values = {
    plan: this.plans,
    status: ['future', 'in_trial', 'active', 'non_renewing', 'cancelled'],
    payment_info_added: ['valid', 'expiring', 'expired']
  };
  stringOperators: Array<string> = ['contains', 'does not contain', 'equals', 'not equal to'];
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
        this.plans.push(plan._id);
      });
    });

    this._script.load('daterangepicker')
      .then((data) => {
        this.scriptLoaded = true;
      }).catch((error) => {
      console.log('Script not loaded', error);
    });
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  setStopDate(date) {
    this.stopDate = date;
  }

  saveHellobar(status) {
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

  reset() {
    this.conditions = [];
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

}
