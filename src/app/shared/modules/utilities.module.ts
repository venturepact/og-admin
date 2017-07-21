import {NgModule} from '@angular/core';
import {DateRangePickerComponent} from '../../site/components/+analytics/components/date_range_picker/date_range_picker.component';
import {DatePickerComponent} from '../../site/components/+analytics/components/date_picker/date_picker.component';   
@NgModule({
  declarations:[DateRangePickerComponent,DatePickerComponent],
  exports: [ DateRangePickerComponent,DatePickerComponent]
})
export class UtilitiesModule {}
