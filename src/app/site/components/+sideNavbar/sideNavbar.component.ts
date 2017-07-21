import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from '../../../shared/services/cookie.service';
import {SubDomainService} from '../../../shared/services/subdomain.service';
import {FeatureAuthService} from '../../../shared/services/feature-access.service';
declare var jQuery: any;
@Component({
  selector: 'og-sideNavbar',
  templateUrl: './sideNavbar.component.html',
  styleUrls: ['./sideNavbar.component.css','./../../+Settings/settings.component.css']
})

export class SideNavbarComponent implements OnInit, AfterViewInit {
  currentTab = 'team-setting';
  sideNaveBarHeader: string = '';
  is_subcripion_cancelled = false;
  isIntegrationsAvailable: Boolean = false;
  IEbrowser : Boolean = false;
  isEmailVerified : Boolean = false;
  isAppsumoCompany : Boolean = false ;
  cookie:any;
  storage:any;
  currentCompany: any;
  isCNameAccess : boolean = false;
  constructor(
    public _cookieService: CookieService,
    public subDomainService: SubDomainService,
    public router: Router,
    public _featureAuthService: FeatureAuthService,
  ) {
    this.currentCompany = subDomainService.currentCompany;
  }
  ngOnInit() {
    this.is_subcripion_cancelled = false;
    let curUrlDomain = window.location.pathname.split('/');
    this.cookie = this._cookieService.readCookie('storage');
    this.storage = this.cookie != null ? JSON.parse(this.cookie) : '';
    this.currentTab = curUrlDomain[curUrlDomain.length - 1];
    //this.showTab(this.currentTab);
    let sub_domain = this.subDomainService.subDomain.sub_domain;
    let plan : string = this.subDomainService.currentCompany.billing.chargebee_plan_id.split('_')[0];
    if(plan === 'business' || plan==='enterprise'){
      this.isCNameAccess = true;
    }
    let companyAccess = JSON.parse(this._cookieService.readCookie('filepicker_token_json'));
    let subscription_status = '';
    if (!companyAccess)
      console.log('');
    //window.location.href = window.location.origin + '/logout';
    else
      companyAccess.forEach((e: any) => {
        if (e.key === sub_domain) {
          subscription_status = e.value;
        }
      });
    if (subscription_status === 'cancelled') {
      this.is_subcripion_cancelled = true;
      jQuery('.wrapper-content').addClass('cancelled-setting');
    }
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (this.currentTab === 'membership' || this.currentTab === 'my-account') && subscription_status != "cancelled") {
      window.location.pathname = window.location.pathname.split('/')[1];
    }
    jQuery('#lgScrWrapperContent').addClass('hide');
    if (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent))
      this.IEbrowser=true;
    else
      this.IEbrowser=false;
      this.isEmailVerified = false;
			if(this.storage.user.emails[0].verification.complete){
				this.isEmailVerified = true;
			}
      if(this.currentCompany.is_appsumo_created && this.currentCompany.billing.chargebee_plan_id==='appsumo_d'){
				 this.isAppsumoCompany = true ;
			}
  }

  ngAfterViewInit(){
    if(this.currentTab === 'settings'){
      jQuery('#teamSet').addClass('active');
      jQuery('#teamSet-m').addClass('active');
    }
    if(this.currentTab === 'integrations'){
      jQuery('#integrations').addClass('active');
      jQuery('#integrations-m').addClass('active');
    }
  }
  showTab(tab: any) {
    this.currentTab = tab;
    jQuery('.setting-nav').removeClass('active');
    if (tab === 'membership') {
      jQuery('#membDet').addClass('active');
      jQuery('#membDet-m').addClass('active');
      //jQuery('.wrapper-content').removeClass('hide');
      this.sideNaveBarHeader = 'Membership Details';
      jQuery('#smScrWrapperContent').css('display', 'block');
      if(this.isEmailVerified === true || this.isAppsumoCompany){
        if(this.IEbrowser){
           jQuery('#membershipDetails').addClass('no-redbar-member-subs');
        }else{
            jQuery('#membershipDetails').removeClass('no-redbar-member-subs');
        }

      }

    }
    else if (tab === 'my-account') {
      jQuery('#accSet').addClass('active');
      jQuery('#accSet-m').addClass('active');
      //jQuery('.wrapper-content').removeClass('hide');
      this.sideNaveBarHeader = 'My Account';
      jQuery('#smScrWrapperContent').css('display', 'block');
    }
    else if (tab === 'team-setting') {
      jQuery('#teamSet').addClass('active');
      jQuery('#teamSet-m').addClass('active');
      //jQuery('.wrapper-content').removeClass('hide');
      this.sideNaveBarHeader = 'Team Settings';
      jQuery('#smScrWrapperContent').css('display', 'block');
    }
    else if (tab === 'api-key') {
      jQuery('#apiKey').addClass('active');
      jQuery('#teamSet-m').addClass('active');
      //jQuery('.wrapper-content').removeClass('hide');
      this.sideNaveBarHeader = 'API Integration';
      jQuery('#smScrWrapperContent').css('display', 'block');
    }
    else if (tab === 'integrations') {
      this.isIntegrationsAvailable = this._featureAuthService.features.integrations.active;
      // console.log("features", this._featureAuthService.features);
      if (!this.isIntegrationsAvailable) {
        this._featureAuthService.setSelectedFeature('integrations');
        jQuery('.integrations').addClass('activegreen limited-label');
        jQuery('#premiumModal').modal('show');
        jQuery('.modal-backdrop').insertAfter('#premiumModal');
        jQuery('#analyticsRef').attr('active',false);
      }else{
        this.router.navigateByUrl('/settings/integrations');
      }
      jQuery('#integrations').addClass('active');
      jQuery('#integrations-m').addClass('active');
      //jQuery('.wrapper-content').removeClass('hide');
      this.sideNaveBarHeader = 'API Integration';
      jQuery('#smScrWrapperContent').css('display', 'block');

    }
    else if (tab === 'my-account') {
      jQuery('#referral').addClass('active');
      jQuery('#referral-m').addClass('active');
      //jQuery('.wrapper-content').removeClass('hide');
      this.sideNaveBarHeader = 'Referral';
      jQuery('#smScrWrapperContent').css('display', 'block');
    }
    else if (tab === 'custom-domain') {
      if(this._featureAuthService.features.cname.active){
          this.router.navigateByUrl('/settings/custom-domain');
          jQuery('#customDomain').addClass('active');
          jQuery('#customDomain-m').addClass('active');
          //jQuery('.wrapper-content').removeClass('hide');
          this.sideNaveBarHeader = 'Custom Domain';
          jQuery('#smScrWrapperContent').css('display', 'block');
      }else{
        this._featureAuthService.setSelectedFeature('cname');
        jQuery('#premiumModal').modal('show');
        jQuery('.modal-backdrop').insertAfter('#premiumModal');
    }
    }
    else if (tab === 'webhook') {
      jQuery('#webhook').addClass('active');
      jQuery('#webhook-m').addClass('active');
      //jQuery('.wrapper-content').removeClass('hide');
      this.sideNaveBarHeader = 'Webhook';
      jQuery('#smScrWrapperContent').css('display', 'block');
    }
  }
  addHide() {
    jQuery('#smScrSideNavbar').addClass('hide');
    jQuery('#setting-header').removeClass('hide');
  }
  goBack() {
    jQuery('#smScrSideNavbar').removeClass('hide');
    jQuery('#setting-header').addClass('hide');
    jQuery('#smScrWrapperContent').css('display', 'none');
  }

}
