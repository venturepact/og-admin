import {Component, ViewEncapsulation, OnInit, Input} from '@angular/core';
import {CookieService} from '../../shared/services/cookie.service';
import {Router} from '@angular/router';
import {Script} from "../../shared/services/script.service";

@Component({
  selector: 'og-sitesettings',
  templateUrl: './sitesettings.component.html',
  styleUrls: ['./sitesettings.component.css', './../ionicons.min.css', './../../../assets/css/sahil-hover.css', './../../../assets/css/custom-material.css', './../../../assets/css/wysiwyg.css'],
  encapsulation: ViewEncapsulation.None,
})

export class SitesettingsComponent implements OnInit {
  @Input() promoGoals: any[];

  constructor(public _cookieService: CookieService,
              public router: Router) {
  }

  ngOnInit() {

    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      if (storage.user.sub_role !== null) {
        this.router.navigate(['/admin/users']);
      }
    }
  }

  getPromoGoals(goals) {
    this.promoGoals = goals;
  }
}

// import {Component, ViewEncapsulation, OnInit, Input} from '@angular/core';
// import { AdminService } from './../../shared/services/admin.service';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Script } from '../../shared/services/script.service';
// import {CookieService} from "../../shared/services/cookie.service";
// import {Router} from "@angular/router";
// declare var jQuery: any;
//
// @Component({
//   selector: 'og-sitesettings',
//   templateUrl: './sitesettings.component.html',
//   styleUrls: ['./sitesettings.component.css', './../ionicons.min.css', './../../../assets/css/sahil-hover.css', './../../../assets/css/custom-material.css', './../../../assets/css/wysiwyg.css'],
//   encapsulation: ViewEncapsulation.None,
// })
//
// export class SitesettingsComponent implements OnInit {
//   edit_appsumo_hellobar: boolean = false;
//   appsumoMessage: any = null;
//   loadingAppsumo: boolean = true;
//
//   edit_trial_hellobar: boolean = false;
//   trialMessage: any = null;
//   loadingTrial: boolean = true;
//
//   edit_promolist_items: boolean = false;
//   loadingPromoList: boolean = true;
//   goals: any = [];
//   goalName: String = "";
//   @Input() promoGoals: any[];
//
//   constructor(public _adminService: AdminService,
//     public _script: Script,
//               public _cookieService: CookieService,
//               public router: Router,
//     public fb: FormBuilder) {
//   }
//   ngOnInit() {
//     this.getHellobarMessage();
//     this.edit_appsumo_hellobar = false;
//
//     this.edit_trial_hellobar = false;
//     this._script.load('wysiwyg')
//       .then((data) => {
//       })
//       .catch((error) => {
//         //any error
//       });
//
//     if (this._cookieService.readCookie('storage')) {
//       let storage = JSON.parse(this._cookieService.readCookie('storage'));
//       if(storage.user.sub_role !== null)
//         this.router.navigate(['/admin/users']);
//     }
//
//     this.getPromolistSettings();
//   }
//
//   getPromoGoals(goals) {
//     this.promoGoals = goals;
//   }
//
//   getHellobarMessage() {
//     let self = this;
//     self.loadingAppsumo = true;
//     self.loadingTrial = true;
//     let getHellobarMessage = self._adminService.getSiteSettings()
//       .subscribe(
//       (success: any) => {
//         self.loadingTrial = false;
//         self.loadingAppsumo = false;
//         self.appsumoMessage = success.appsumoHelloBar;
//
//         self.trialMessage = success.trialHelloBar;
//       }, (error: any) => {
//         //console.log('getHellobarMessage', error);
//         getHellobarMessage.unsubscribe();
//         self.loadingTrial = false;
//         self.loadingAppsumo = false;
//       }
//       );
//   }
//
//   editAppsumoMessage() {
//     let self = this;
//     self.loadingAppsumo = true;
//     let editAppsumoMessage = self._adminService.editMessage({ edit_appsumoMessage: self.appsumoMessage }, 'appsumo')
//       .subscribe(
//       (success: any) => {
//         self.edit_appsumo_hellobar = false;
//         self.loadingAppsumo = false;
//         self.appsumoMessage = success.appsumoHelloBar;
//       }, (error: any) => {
//         self.froalaInit('appsumo');
//         editAppsumoMessage.unsubscribe();
//         self.loadingAppsumo = false;
//       }
//       );
//   }
//
//   editTrialMessage() {
//     let self = this;
//     self.loadingTrial = true;
//     let editTrialMessage = self._adminService.editMessage({ edit_trialMessage: self.trialMessage }, 'trial')
//       .subscribe(
//       (success: any) => {
//         self.edit_trial_hellobar = false;
//         self.loadingTrial = false;
//         self.trialMessage = success.trialHelloBar;
//
//       }, (error: any) => {
//         self.froalaInit('trial');
//         editTrialMessage.unsubscribe();
//         self.loadingTrial = false;
//       }
//       );
//   }
//
//   froalaInit(type) {
//     let editor: any;
//     let self = this;
//     setTimeout(function () {
//       editor = jQuery('.wysiwyg-' + type).froalaEditor({
//         heightMax: 250,
//         toolbarButtons: ['bold', '|', 'italic', '|', 'underline', '|', 'strikeThrough'],
//         shortcutsEnabled: ['bold', 'italic', 'underline'],
//       });
//       if (type === 'appsumo') {
//         jQuery('.wysiwyg-appsumo').on('froalaEditor.contentChanged', (e: any, editor: any) => {
//           self.appsumoMessage = e.currentTarget.value;
//         });
//       }
//       else {
//         jQuery('.wysiwyg-trial').on('froalaEditor.contentChanged', (e: any, editor: any) => {
//           self.trialMessage = e.currentTarget.value;
//         });
//       }
//     }, 10);
//   }
//
//   getPromolistSettings() {
//     let self = this;
//     let siteSettings = self._adminService.getSiteSettings()
//       .subscribe(
//         (success: any) => {
//           self.goals = success.promotionCheckList.goals.map(goal => {
//             return { name: goal, edit: false }
//           });
//           self.loadingPromoList = false;
//         },
//         (error: any) => {
//           siteSettings.unsubscribe();
//           self.loadingPromoList = false;
//         }
//       )
//   }
//
//   addGoal() {
//     let self = this;
//     self.goals.push({ name: self.goalName.trim(), edit: false});
//     self.goalName = "";
//     self._adminService.updateSiteSettings({
//       'promotionCheckList': {
//         'goals': self.goals.map(goal => {
//           return goal.name;
//         })
//       }
//     })
//       .subscribe(
//         (success:any) => console.log(success),
//         (error: any) => console.log(error)
//       )
//   }
//
//   deleteGoal(goal) {
//     let self = this;
//     let index = this.goals.indexOf(goal);
//     this.goals.splice(index, 1);
//
//     self._adminService.updateSiteSettings({
//       'promotionCheckList': {
//         'goals': self.goals.map(goal => {
//           return goal.name;
//         })
//       }
//     })
//       .subscribe(
//         (success:any) => console.log(success),
//         (error: any) => console.log(error)
//       )
//   }
// }
