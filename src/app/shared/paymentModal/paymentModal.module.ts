import { NgModule } from '@angular/core';
import {SharedModule} from '../modules/shared.module';
import {PaymentModalComponent} from './paymentModal.component';

@NgModule({
  imports: [SharedModule],
  declarations: [PaymentModalComponent],
  exports: [PaymentModalComponent]
})

export class PaymentModalModule {
}
