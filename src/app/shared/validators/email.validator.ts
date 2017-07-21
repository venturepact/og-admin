import { FormControl } from '@angular/forms';
import { ValidationResult } from './validation-result';

export class EmailValidator {

  static format(control: FormControl): ValidationResult {
    var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (control.value !== '' && !EMAIL_REGEXP.test(control.value)) {
      return { 'checkmail': true };
    }
    return null;
  }
}

