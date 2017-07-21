import { NgModule } from '@angular/core';
import {SharedModule} from '../modules/shared.module';
import {VideoModalComponent} from './videoPopup.component';

@NgModule({
  imports: [SharedModule],
  declarations: [VideoModalComponent],
  exports: [VideoModalComponent]
})

export class VideoModalModule {
}
