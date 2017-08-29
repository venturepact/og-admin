import {Component, OnInit, Input} from '@angular/core';
import {AdminService} from '../../../shared/services/admin.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

declare var jQuery: any;

@Component({
  selector: 'og-promo-goals',
  templateUrl: './promo-goals.component.html',
  styleUrls: ['./promo-goals.component.css']
})
export class PromoGoalsComponent implements OnInit {
  loading: Boolean = true;
  @Input() goals: string[];
  promoGoalsForm: FormGroup;
  errorMessage: string = null;

  constructor(public _adminService: AdminService) {
  }

  ngOnInit() {
    this.promoGoalsForm = new FormGroup({
      promoGoal: new FormControl('', [Validators.required])
    });
  }

  deleteGoal(goal) {
    const self = this;
    self.errorMessage = null;
    const deleteGoal = self._adminService.updateSiteSettings({promoGoal: goal}).subscribe(
      (success: any) => {
        self.goals = success.promotionCheckList.goals;
        deleteGoal.unsubscribe();
      },
      (error: any) => {
        console.log('error', error);
        self.errorMessage = error.error.err_message;
        deleteGoal.unsubscribe();
      }
    );
  }

  saveGoal() {
    if (this.promoGoalsForm.value.promoGoal && !this.duplicate(this.promoGoalsForm.value.promoGoal)) {
      jQuery('.btnAdd').attr('disabled', true).html('Please wait...');
      const self = this;
      self.errorMessage = null;
      const saveGoal = self._adminService.updateSiteSettings(self.promoGoalsForm.value).subscribe(
        (success: any) => {
          self.goals = success.promotionCheckList.goals;
          self.promoGoalsForm.value.promoGoal = '';
          jQuery('#promoGoal').val('');
          jQuery('.btnAdd').attr('disabled', false).html('Add');
          saveGoal.unsubscribe();
        },
        (error: any) => {
          console.log('error', error);
          self.errorMessage = error.error.err_message;
          jQuery('.btnAdd').attr('disabled', false).html('Add');
          saveGoal.unsubscribe();
        }
      );
    }
  }

  duplicate(goal) {
    if (this.goals.indexOf(goal) !== -1) {
      this.errorMessage = 'Duplicate goal';
      this.promoGoalsForm.value.promoGoal = '';
      return true;
    }
    return false;
  }

}
