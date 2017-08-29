import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AdminService} from '../../../shared/services/admin.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Script} from '../../../shared/services/script.service';

declare var jQuery: any;

@Component({
  selector: 'og-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  loading: boolean = true;
  editAppsumo: boolean = false;
  editAppsumo_black: boolean = false;
  editdealfuel: boolean = false;
  editwebmaster: boolean = false;
  editaffilates: boolean = false;
  edittrial: boolean = false;
  @Output() promogoals: EventEmitter<any> = new EventEmitter<any>();
  appsumoMessage: any = null;
  appsumoblackMessage: any = null;
  dealfuelMessage: any = null;
  webmasterMessage: any = null;
  affilatesMessage: any = null;
  trialMessage: any = null;
  messageForm: FormGroup;

  constructor(public _adminService: AdminService,
              public _script: Script) {
  }

  ngOnInit() {
    this._script.load('wysiwyg').then((data) => {
    }).catch((error) => {
    });
    this.getSightSettings();
  }

  private getSightSettings() {
    const self = this;
    this.loading = true;
    const getSightSettings = self._adminService.getSiteSettings()
      .subscribe(
        (success: any) => {
          self.promogoals.emit(success.promotionCheckList.goals);
          self.appsumoMessage = success.appsumoHelloBar;
          self.appsumoblackMessage = success.appsumoblackHelloBar;
          self.dealfuelMessage = success.dealfuelHelloBar;
          self.webmasterMessage = success.webmasterHelloBar;
          self.affilatesMessage = success.affilatesHelloBar;
          self.trialMessage = success.trialHelloBar;
          self.loading = false;
        }, (error: any) => {
          console.log('error getSightSettings', error);
          getSightSettings.unsubscribe();
        }
      );
  }

  editMessage(type) {
    let message = '';
    if (type === 'appsumo') {
      message = this.appsumoMessage;
      this.editAppsumo = !this.editAppsumo;
      this.editAppsumo_black = false;
      this.editdealfuel = false;
      this.editwebmaster = false;
      this.editaffilates = false;
      this.edittrial = false;
    } else if (type === 'appsumo_black') {
      this.editAppsumo = false;
      this.editdealfuel = false;
      this.editwebmaster = false;
      this.editaffilates = false;
      this.edittrial = false;
      this.editAppsumo_black = !this.editAppsumo_black;
      message = this.appsumoblackMessage;
    } else if (type === 'dealfuel') {
      this.editAppsumo = false;
      this.editAppsumo_black = false;
      this.editwebmaster = false;
      this.editaffilates = false;
      this.edittrial = false;
      this.editdealfuel = !this.editdealfuel;
      message = this.dealfuelMessage;
    } else if (type === 'webmaster') {
      this.editAppsumo = false;
      this.editAppsumo_black = false;
      this.editdealfuel = false;
      this.editaffilates = false;
      this.edittrial = false;
      this.editwebmaster = !this.editwebmaster;
      message = this.webmasterMessage;
    } else if (type === 'affilates') {
      this.editAppsumo = false;
      this.editAppsumo_black = false;
      this.editdealfuel = false;
      this.editwebmaster = false;
      this.edittrial = false;
      this.editaffilates = !this.editaffilates;
      message = this.affilatesMessage;
    } else if (type === 'trial') {
      this.editAppsumo = false;
      this.editAppsumo_black = false;
      this.editdealfuel = false;
      this.editwebmaster = false;
      this.editaffilates = false;
      this.edittrial = !this.edittrial;
      message = this.trialMessage;
    }
    this.messageForm = new FormGroup({
      message: new FormControl(message, [])
    });
    this.froalaInit(type);
  }

  saveMessage(type) {
    const self = this;
    jQuery('.btnSave').attr('disabled', true).html('Please wait...');
    jQuery('.btnCancel').attr('disabled', true);
    const saveMessage = self._adminService.editMessage(this.messageForm.value, type)
      .subscribe(
        (success: any) => {
          self.appsumoMessage = success.appsumoHelloBar;
          self.appsumoblackMessage = success.appsumoblackHelloBar;
          self.dealfuelMessage = success.dealfuelHelloBar;
          self.webmasterMessage = success.webmasterHelloBar;
          self.affilatesMessage = success.affilatesHelloBar;
          self.trialMessage = success.trialHelloBar;

          this.editAppsumo = false;
          this.editAppsumo_black = false;
          this.editdealfuel = false;
          this.editwebmaster = false;
          this.editaffilates = false;
          this.edittrial = false;
          saveMessage.unsubscribe();
        }, (error: any) => {
          console.log('saveMessage error', error);
          jQuery('.btnSave').attr('disabled', false).html('Save');
          jQuery('.btnCancel').attr('disabled', false);
          saveMessage.unsubscribe();
        }
      );
  }

  froalaInit(type) {
    console.log('typeeeeeeeeeeeeeee', type);
    let editor: any;
    const self = this;
    setTimeout(function () {
      editor = jQuery('.wysiwyg-' + type).froalaEditor({
        heightMax: 250,
        toolbarButtons: ['bold', '|', 'italic', '|', 'underline', '|', 'strikeThrough'],
        shortcutsEnabled: ['bold', 'italic', 'underline'],
      });
      jQuery('.wysiwyg-' + type).on('froalaEditor.contentChanged', (e: any, editor: any) => {
        self.messageForm.value.message = e.currentTarget.value;
      });
      jQuery('.fr-command').css('width', 'inherit !important');
    }, 10);
  }

}
