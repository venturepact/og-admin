import {Component, OnInit, Input, Output, ViewEncapsulation, AfterViewInit, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {LoggedIn} from '../../../shared/interfaces/logged-in.interface';
import {Company} from './../../../shared/models/company';
import {FeatureAccess} from '../../../shared/interfaces/features.interface';
import {environment} from '../../../../environments/environment';
import {Script} from '../../../shared/services/script.service';
import {CookieService} from '../../../shared/services/cookie.service';
import {FeatureAuthService} from '../../../shared/services/feature-access.service';
import {CompanyService} from '../../../shared/services/company.service';
import {UserService} from '../../../shared/services/user.service';
import {LoggedInService} from '../../../shared/services/logged-in.service';
import {SubDomainService} from '../../../shared/services/subdomain.service';
import {SettingsCommunicationService} from "../../../shared/services";

declare var jQuery: any;
declare var window: any;
declare var ga: any;
// declare var _kmq:any;

@Component({
  selector: 'sd-toolbar',
  templateUrl: './toolbar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './toolbar.component.css'
  ]
})

export class ToolbarComponent implements OnInit, AfterViewInit {
  @Input() page: string;
  loader: Number = 0;
  loggedIn: LoggedIn = {isLoggedIn: false};
  name: String;
  userId: String;
  subDomainExt: any;
  currentUrl: any;
  isSubDomainUrl: Boolean = false;
  planId: string = null;
  companyInitial: string = '';
  companyName: String = '';
  currentRoute: string = '';
  isEmailVerified: Boolean = true;
  isAppsumoCompany: Boolean = false;
  isAppsumoNotification: Boolean = false
  isInTrial: string = 'active';
  cardStatus: String = 'valid';
  appsumoHellobarMessage: string = '';
  isappSumoMessageExist: Boolean = false;
  trialHellobarMessage: string = '';
  currentPlanId: string = '';
  myCompanies: any;
  mycompanyLength: number = 0;
  co: any;
  isAnalyticsAvailable: Boolean = true;
  cookiesStatus: boolean = false;
  respTitle: string = '';
  isAdminCreated: boolean = false;
  is_subcripion_cancelled: boolean = false;
  subsStatus: String = '';
  IEbrowser: boolean = false;
  showDashboardLink: Boolean = true;
  showReferralCandy: Boolean = false;
  cookie: any;
  storage: any;
  currentCompany: any;
  @Output() notify = new EventEmitter();

  constructor(public _subDomainService: SubDomainService,
              public loggedInService: LoggedInService,
              public _userService: UserService,
              public _companyService: CompanyService,
              public _featureAuthService: FeatureAuthService,
              public settingsCommunicationService: SettingsCommunicationService,
              public _cookieService: CookieService,
              public router: Router,
              public _script: Script) {
    this.cookie = _cookieService.readCookie('storage');
    this.storage = this.cookie != null ? JSON.parse(this.cookie) : '';
    if (this.cookie != null) {
      this.loggedIn = {isLoggedIn: true};
      this.name = this.storage.user.name;
      this.currentCompany = _subDomainService.currentCompany;
    }
    // console.log('toolbar',this.currentCompany);
    // console.log('cookie storage',storage);
    //CODE TO CHECK FOR SUBSCRIPTION STATUS AND HIDE CTAs ACCORDINGLY START
    let plan_id = this.currentCompany ? this.currentCompany.billing.chargebee_plan_id : '';
    let companyAccess = JSON.parse(this._cookieService.readCookie('filepicker_token_json'));
    let subscription_status = '';
    if (companyAccess)
      companyAccess.forEach((e: any) => {
        if (e.key === this._subDomainService.subDomain.sub_domain) {
          subscription_status = e.value;
        }
      });
    //console.log('subscription_status',subscription_status);
    if (((subscription_status == "active" && plan_id == 'freemium') || subscription_status == "cancelled" ) && this.cookie != null && !this.currentCompany.is_admin_created) {
      this.showDashboardLink = false;
    }
    //CODE TO CHECK FOR SUBSCRIPTION STATUS AND HIDE CTAs ACCORDINGLY END

    this.isSubDomainUrl = this._subDomainService.subDomain.is_sub_domain_url;
    if (this.isSubDomainUrl) {
      this.companyInitial = this._subDomainService.subDomain.sub_domain.charAt(0).toUpperCase();
      this.companyName = this._subDomainService.subDomain.sub_domain.charAt(0).toUpperCase() + this._subDomainService.subDomain.sub_domain.slice(1);
    }
    this.appsumoHellobarMessage = null;
    this.isAppsumoNotification = false
  }


  ngOnInit() {
    let s = {
      cardStatus: 'nocard'
    };
    // console.log("toolbar oninit");
    this.currentRoute = window.location.href.split('/')[3];
    if (this.currentRoute == 'settings')
      this.loader = 0
    //this._cookieService.createCookie('status',JSON.stringify(s),3);
    // jQuery('.cookies-header').addClass('hide');
    jQuery(window).scroll(function () {
      var scroll = jQuery(window).scrollTop();

      if (scroll >= 100) {
        jQuery(".navbar-fixed-top").addClass("header-boxshadow");
      } else {
        jQuery(".navbar-fixed-top").removeClass("header-boxshadow");
      }
    });
    if (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent))
      this.IEbrowser = true;
    else
      this.IEbrowser = false;

    this.currentUrl = '';
    if (this.loggedIn.isLoggedIn)
      this.getCompanies();
    this.subDomainExt = '.' + environment.APP_EXTENSION;
    // console.log("t2");
    //this.loggedIn = this.loggedInService.loggedIn;
    let sub_domain = this._subDomainService.subDomain.sub_domain;
    let companyAccess = JSON.parse(this._cookieService.readCookie('filepicker_token_json'));
    if (this.cookie != null && this.currentCompany) {
      console.log("t1");
      this.name = this.storage.user.name;
      this.userId = this.storage.user._id;
      this.planId = this.currentCompany.billing.chargebee_plan_id;
      this.isAdminCreated = this.currentCompany.is_admin_created;
      this.isEmailVerified = false;
      this.showReferralCandy = ( this.currentCompany.referral.is_referralcandy_visible && this.currentCompany.current_referral_program == 'REFERRALCANDY' && this.currentCompany.referral.referralcandy_url != null );
      // console.log('showReferralCandy',this.planId.split('_')[0],this.showReferralCandy,storage.company.referral);
      if (this.storage.user.emails[0].verification.complete) {
        this.isEmailVerified = true;
      }
      console.log("t2");
      if (this.currentCompany.is_appsumo_created && this.currentCompany.billing.chargebee_plan_id === 'appsumo_d') {
        this.isAppsumoCompany = true;
      }
      //this.isAppsumoCompany = storage.company.is_appsumo_created;
      //this.currentPlanId = storage.company.billing.chargebee_plan_id;
    }

    let subscription_status = '';
    // console.log("t4");
    if (companyAccess) {
      // console.log("t5");
      let companyAccessLength = companyAccess.length;
      for (let i = 0; i < companyAccessLength; i++)
        if (companyAccess[i].key === sub_domain) subscription_status = companyAccess[i].value;
    }
    // companyAccess.forEach((e: any) => {
    // 	if (e.key === sub_domain) {
    // 	subscription_status = e.value;
    // 	}
    // });
    if (subscription_status === 'cancelled') {
      this.is_subcripion_cancelled = true;
    }
    this.co = window.location.href.split('//')[1].split('.')[0];
    this.respTitle = window.location.href.split('//')[1].split('/')[1];
    if (this.co !== 'app' && this.loggedIn.isLoggedIn) {
      // console.log("t6");
      //console.log('co',this.co);
      this._companyService.isSubDomainExist(this.co)
        .subscribe(
          (success: any) => {
            // localStorage.setItem('company', success._id);
            this._companyService.getCompanyUsers(success._id)
              .subscribe(
                (success: any) => {
                  for (var i = 0; i < success.length; i++) {
                    if (success[i].username === this.storage.user.username) {
                      localStorage.setItem('role', success[i].user_company.role);
                      this._cookieService.createCookie('role', success[i].user_company.role, 3);
                      break;
                    }
                  }
                },
                (error: any) => {
                  //console.log('company users Error', error);
                }
              );
          },
          (error: any) => {
            //console.log('company Error', error);
          }
        );
    }
    // console.log("t7");
    if (this.cookie != null)
      this.isAnalyticsAvailable = this._featureAuthService.features.analytics.active;
    this.cardStatus = '';
    this.subsStatus = '';
    let status: any = this._cookieService.readCookie('status');
    if (status) {
      status = JSON.parse(status);
      this.cardStatus = status.cardStatus;
      this.subsStatus = status.subsStatus;
    }
    //console.log(this.cardStatus,'cardddddddddddddddddd');
    if (this.isAdminCreated && this.subsStatus === 'cancelled') {
      setTimeout(function () {
        jQuery('#new-setup-payment').modal({backdrop: 'static', keyboard: false});
        jQuery('#new-setup-payment').modal('show');
      }, 200);
    }
    this.settingsCommunicationService.company$.subscribe(company => {
      this.myCompanies = company;
    });
  }

  ngAfterViewInit() {
    this.showNotification();
    let self = this;
    this._script.load('slimScroll').then((data: any) => {
      jQuery('.slimscroll').slimscroll({
        railVisible: true,
        alwaysVisible: true
      });
    }).catch((error) => {
      //console.log('Script not loaded', error);
    });
    setTimeout(function () {
      let status: any = self._cookieService.readCookie('status');
      if (status) {
        status = JSON.parse(status);
        this.cardStatus = status.cardStatus;
        this.subsStatus = status.subsStatus;
      }
      jQuery('.slimscroll').slimscroll({
        railVisible: true,
        alwaysVisible: true
      });
    }, 500);
    if (this.isAppsumoCompany) {
      this.getHellobarMessage();
    }
  }

  ccpopop() {
    let status = JSON.parse(this._cookieService.readCookie('status'));
    if (status.cardStatus !== 'valid') {
      localStorage.setItem('openpopup', 'true');
      jQuery('#cc-modal-payment').modal('show');
      jQuery('.modal-backdrop').insertAfter('#cc-modal-payment');
      jQuery('#cc-modal-payment').on('hidden.bs.modal', function () {
        localStorage.setItem('openpopup', 'true');
      });
    } else {
      jQuery('button[id=essentials_m]').trigger('click');
    }
  }

  showNotification() {
    if (this.isEmailVerified === false) {
      jQuery('#main-div').addClass('settings-cookies');
      if (this.IEbrowser) {
        jQuery('#main-div').addClass('ie-main-wrapper');
        jQuery('#new-header').addClass('ie-header-parent');
        jQuery('.dashboard-topsec, .wrapper, .left-sidebar, .membership-details-inner-tabs').addClass('ie-dashboard-cookies');
        jQuery('#new-header').addClass('no-redbar');
        jQuery('#nav-cookies-div').addClass('no-redbar');
        //jQuery('#smScrSideNavbar').addClass('no-redbar');
        jQuery('#settings-main-panel').addClass('no-redbar');
        jQuery('#smScrWrapperContent').addClass('no-redbar');
      }
      jQuery('.dashboard-topsec, .left-sidebar, .membership-details-inner-tabs').addClass('dashboard-cookies');
      jQuery('#new-header').addClass('cookies-parent');
      jQuery('.wrapper').removeClass('dashboard-cookies settings-main-panel');
    } else {
      jQuery('.wrapper').removeClass('settings-main-panel');
      if (this.IEbrowser) {
        jQuery('#new-header').addClass('no-redbar');
        jQuery('#nav-cookies-div').addClass('no-redbar');
      } else {
        jQuery('.wrapper').removeClass('settings-main-panel');
        jQuery('#membershipDetails').removeClass('no-redbar-member-subs');
      }
    }
  }

  appSumoNotification() {
    let self = this;
    if (self.isAppsumoNotification) {
      jQuery('#new-header').addClass('cookies-parent');
      jQuery('#main-div').addClass('settings-cookies');
      jQuery('.dashboard-topsec, .left-sidebar, .membership-details-inner-tabs').addClass('dashboard-cookies');
      jQuery('.wrapper').removeClass('dashboard-cookies settings-main-panel');
    }
    jQuery('#membershipDetails').removeClass('no-redbar-member-subs');
    jQuery('.wrapper').removeClass('settings-main-panel');
    //jQuery('.dashboard-topsec, .wrapper, .left-sidebar, .membership-details-inner-tabs').removeClass('dashboard-cookies');
  }

  getCompanies() {
    let self = this;
    // console.log("inside get companies");
    this._companyService.getCompanies()
      .subscribe(
        (data: any) => {
          self.myCompanies = [];
          if (data) {
            // console.log("t1",data);
            data.forEach((company: any) => {

              if (company.user_company.status !== 'LEFT' && company.user_company.status !== 'DELETED' && company.user_company.status !== 'REQUESTED' && company.user_company.active) {
                self.myCompanies.push(new Company(company));
              }
            });
            self.settingsCommunicationService.updateCompanyList(self.myCompanies);
          }
          self.mycompanyLength = self.myCompanies.length;
          setTimeout(function () {
            jQuery('.slimscroll').slimscroll({
              railVisible: true,
              alwaysVisible: true
            });
          }, 500);
        },
        (response: any) => {
          //console.log('users_companies error toolbar', response);
        }
      );
  }

  videoModal() {
    jQuery('#video-modal').modal('show');
  }

  getHellobarMessage() {
    let self = this;
    let getHellobarMessage = this._companyService.getHellobarMessage()
      .subscribe(
        (success: any) => {
          self.appsumoHellobarMessage = success.appsumoHelloBar;
          self.trialHellobarMessage = success.trialHelloBar;

          if (self.appsumoHellobarMessage) {
            self.isAppsumoNotification = true;
            self.appSumoNotification();
          } else {
            jQuery('#new-header').removeClass('cookies-parent');
            jQuery('.wrapper').removeClass('settings-main-panel');
            jQuery('.dashboard-topsec, .wrapper, .left-sidebar, .membership-details-inner-tabs').removeClass('dashboard-cookies');
            jQuery('#main-div').removeClass('settings-cookies');
            self.isAppsumoNotification = false;
          }
          this.notifyBuilder();
        },
        (error: any) => {
          getHellobarMessage.unsubscribe();
        }
      );
  }

  checkCookies() {
    if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
      this.cookiesStatus = navigator.cookieEnabled;
      if (this.cookiesStatus) {
        jQuery('.cookies-header').removeClass('hide');
        jQuery('#nav-cookies-div').addClass('cookies-parent');
        if (this.IEbrowser)
          jQuery('#nav-cookies-div').addClass('ie-header-parent');
        jQuery('.navbar-fixed-top').parent('.main-div').addClass('cookies-main');
      }
    }
  }

  resendEmail() {
    this._userService.resendEmail(this.userId)
      .subscribe(
        (success: any) => {
          window.toastNotification('Email has been sent, Please check your email.');
        },
        (error: any) => {
          //console.log('company Error', error);
        }
      );
  }

  onLogout() {
    localStorage.setItem('doingLogout', 'true');
    if (this._userService.logout()) {
      this.loggedInService.logout();
      localStorage.clear();
      window.location.href = environment.APP_DOMAIN;
    }
  }

  close() {
    jQuery('.cookies-header').addClass('hide');
    jQuery('#main-div').removeClass('settings-cookies ie-main-wrapper');
    jQuery('.dashboard-topsec, .wrapper, .left-sidebar, .membership-details-inner-tabs').removeClass('dashboard-cookies ie-dashboard-cookies');
    jQuery('#new-header').removeClass('cookies-parent ie-header-parent');
    if (this.IEbrowser) {
      jQuery('#new-header').addClass('no-redbar');
      jQuery('#nav-cookies-div').addClass('no-redbar');
      jQuery('#smScrSideNavbar').addClass('no-redbar ie-dashboard-cookies');
      jQuery('#lgScrSideNavbar').addClass('no-redbar ie-dashboard-cookies');
      jQuery('#membershipDetails').addClass('no-redbar-member-subs');
      jQuery('#lgScrSideNavbar').addClass('no-redbar-member-subs');

    } else {
      jQuery('#new-header').removeClass('no-redbar');
      jQuery('#nav-cookies-div').removeClass('no-redbar');
      jQuery('#smScrSideNavbar').removeClass('no-redbar');
      //jQuery('#lgScrSideNavbar').removeClass('ie-dashboard-cookies');
      jQuery('.wrapper').removeClass('settings-main-panel');
      jQuery('#membershipDetails').removeClass('no-redbar-member-subs');
      jQuery('#lgScrSideNavbar').removeClass('no-redbar-member-subs');
      jQuery('#membershipDetails').removeClass('no-redbar-member-subs');
      jQuery('#left-sidebar-tabs-left').removeClass('no-redbar');
      jQuery('#smScrWrapperContent').removeClass('no-redbar');
    }
  }

  analyticsClick(event: any) {
    this.isAnalyticsAvailable = this._featureAuthService.features.analytics.active;
    if (!this.isAnalyticsAvailable) {
      event.preventDefault();
      this._featureAuthService.setSelectedFeature('analytics');
      jQuery('.analytics').addClass('activegreen limited-label');
      jQuery('#premiumModal').modal('show');
      jQuery('.modal-backdrop').insertAfter('#premiumModal');
      jQuery('#analyticsRef').attr('active', false);
    }
    else {
      jQuery('#analyticsRef').attr('active', true);
      this.router.navigate(['/analytics']);
    }
  }

  header(title: string) {
    this.respTitle = title;
    if (title === 'settingsPlan') {
      localStorage.setItem('settings', 'true');
      this.loader = 1;
      this.router.navigate(['/settings/membership']);
    }
    else if (title.indexOf('settings') == 0) {
      this.loader = 1;
      this.router.navigate(['/' + title + '/membership']);
    }
    else if (title == "Dashboard")
      this.router.navigate(['/dashboard']);
  }

  callGA() {
    ga('markettingteam.send', 'event', 'ResendVerificationEmail', 'Click', 'Dashboard');
    // _kmq.push(['record', 'Resend verification email link click']);
  }

  notifyBuilder() {
    let data = {};
    if (this.isAppsumoCompany) {
      data['message'] = this.appsumoHellobarMessage;
      data['cardStatus'] = this.cardStatus;
    }
    if (data['message']) {
      this.notify.emit({
        data: data
      });
    }
  }

  openModal(event) {
    jQuery('button[id=essentials_m]').trigger('click');
  }

  changeCompany(subdomain: string) {
    this._userService.changeUserCompany(subdomain)
      .subscribe(
        (response: any) => {
          if (response) {
            let cookie = this._cookieService.readCookie('storage');
            if (cookie) {
              let cookieData: any = JSON.parse(cookie);
              cookieData.token = response;
              cookieData.currentCompany = subdomain;
              this._cookieService.createCookie('storage', JSON.stringify(cookieData), 3);
              window.location.href = environment.PROTOCOL + subdomain + '.' + environment.APP_EXTENSION + '/dashboard';
            }
          }
        },
        (error: any) => {
        }
      );
  }
}