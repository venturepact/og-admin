import {Component, OnInit } from '@angular/core';
import {Plans} from '../models/plans';
import {Estimate} from '../models/estimate';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import {PlanFeatures} from '../../shared/models/planFeatures';
import {CurrentCompany} from '../../shared/models/company';
import {FeatureAuthService} from "../services/feature-access.service";
import {FeatureAccess} from '../../shared/interfaces/features.interface';
import {CookieService} from '../services/cookie.service';
import {SubDomainService} from '../services/subdomain.service';
import {MembershipService} from '../services/membership.service';
import {NumberFormater} from "../services/helper-service/number-format";
declare var jQuery: any;
declare var ga: any;
// declare var _kmq: any;
declare var window: any;

@Component({
  selector: 'og-premium-modal',
  styleUrls: ['./css/premium.style.css','./../../../assets/css/sahil-hover.css', './../../../assets/css/custom-material.css'],
  templateUrl: './premiumModal.component.html',
})

export class PremiumModalComponent implements OnInit{
  allPlans: any = [];
  viewPlans: any = [];
  planFeatures: any = [];
  monthsArray:any = [];
  yearsArray:any = [];
  currentYear:any = '';
  cycle: string = 'y';
  freelancer_m_price: number = 0;
  essentials_m_price: number = 0;
  business_m_price: number = 0;
  enterprise_m_price: number = 0;
  selectdePlan: any = '';
  error: boolean = false;
  errorMessage: string = '';
  loading: boolean = true;
  estimation: any = '';
  invoiceEstimate: any = '';
  couponCode: string = '';
  currentPlan_id: any = '';
  cardStatus: string = 'no_card';
  billingCycle: string = '';
  couponForm: FormGroup;
  setupPaymentPremium:FormGroup;
  cardValid:boolean = false;
  cardType: string = '';
  couponCodeModal: String = '';
  couponOffer:any = '';
  couponDiscount:any = '';
  seletedFeature:string = '';
  featureName:string = '';
  featureDescrip:string = '';
  featureMediaLink:string = '';
  featureMediaType:string = '';
  featureSubfeature:any = [];
  companyFeature:any = [];
  isAppsumoUser:boolean = false;
  currentCompany: any;

  loadingPlans: boolean = true;
  freelancer_plans:any = [];
  essentials_plans:any = [];
  business_plans:any = [];
  freelancer: any = {};
  essentials: any = {};
  business: any = {};
  essentials_m:number = 59;
  business_m:number = 0;
  freelancer_m:number = 0;
  enterprise_m:number = 0;
  constructor(
    public _cookieService: CookieService,
    public _membershipService: MembershipService,
    public _featureAuthService: FeatureAuthService,
    public fb: FormBuilder,
    public _subDomainService: SubDomainService
  ) {
    this.currentCompany = _subDomainService.currentCompany;
  }

  ngOnInit() {
    this.currentPlan_id = this.currentCompany ? this.currentCompany.billing.chargebee_plan_id : '';
    this.isAppsumoUser = this.currentCompany ? this.currentCompany.is_appsumo_created : false;
    this.cardStatus = JSON.parse(this._cookieService.readCookie('status')).cardStatus;
    this.couponForm = this.fb.group({
      couponInput: [this.couponCodeModal, Validators.compose([Validators.required, Validators.minLength(2)])]
    });
    this.monthsArray = [ '01', '02', '03','04','05', '06', '07','08','09', '10', '11','12' ];
    this.yearsArray = [ '2016', '2017', '2018','2019','2020', '2021', '2022','2023','2024', '2025', '2026','2027'];
    this.currentYear =  (new Date).getFullYear();
    this.setupPaymentPremium = this.fb.group({
      cardNumber1 : ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      cardNumber2 : ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      cardNumber3 : ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      cardNumber4 : ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      nameOnCard : ['', Validators.compose([Validators.required,Validators.minLength(3)])],
      cvv : ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(4),Validators.pattern('^[0-9]*$') ])],
      cardMonth: ['', Validators.compose([Validators.minLength(1),Validators.pattern('^[0-9]*$')])],
      cardYear: ['', Validators.compose([Validators.pattern('^[0-9]*$')])]
    });
    this.getAllPlans();
    this.getPaymentDetails();
    this.getCompanyFeatures();
    jQuery('#premiumModal').on('hidden.bs.modal', function() {
      jQuery('.greenClass').removeClass('activegreen');
    });
    let self = this;
    jQuery('#premiumModal').on('show.bs.modal', function (e) {
      setTimeout(function () {
        self.featureName = '';
        self.featureDescrip = '';
        self.featureSubfeature = [];
        //console.log(self._featureAuthService.selectedFeature,self._featureAuthService.subfeature,'ioioioioioioioi');
        self.companyFeature.forEach((feature)=>{
          if(feature.feature._id === self._featureAuthService.selectedFeature){
            if(self._featureAuthService.subfeature === null){
             // console.log('when subfeature is nullllllll');
              self.featureName = feature.feature.heading;
              self.featureDescrip = feature.feature.description;
              self.featureMediaLink = feature.feature.media_link;
              self.featureMediaType = feature.feature.media_type;
              self.featureSubfeature = feature.sub_features;

              return true;
            }else{
              feature.sub_features.forEach((subfeature) =>{
                if(subfeature.feature._id == self._featureAuthService.subfeature){
                  self.featureName = subfeature.feature.heading;
                  self.featureDescrip = subfeature.feature.description;
                  self.featureMediaLink = subfeature.feature.media_link;
                  self.featureMediaType = subfeature.feature.media_type;
                  self.featureSubfeature = subfeature.sub_features;
                  //console.log(self.featureMediaLink,self.featureMediaType,subfeature,'mediaaaaaaaaaaaaaa');
                  return true;
                }
              });
              return true;
            }
          }
        });
        if(self.featureName === ''){
          self.featureName = self._featureAuthService.selectedFeature;
          self.featureDescrip = 'Reached ' +self._featureAuthService.selectedFeature+' limits.';
          switch(self._featureAuthService.selectedFeature){
            case 'Need more calculators?' :
            self.featureDescrip = 'You have exhausted your calculator/quiz limit. Please upgrade to unlock more.';                 self.featureMediaLink = "https://s3.amazonaws.com/outgrow-assets/calculators.png";
            self.featureMediaType = "IMAGE";
            break;

            case 'Team Getting Bigger?' :
            self.featureDescrip = 'You have exhausted your collaborator limit. But you can easily get more.';
            self.featureMediaLink = "https://s3.amazonaws.com/outgrow-assets/users.png";
            self.featureMediaType = "IMAGE";
            break;
          }
        }
      },100);
    });

    jQuery('#estimate-popup').on('hidden.bs.modal',function(){
      setTimeout(function () {
        jQuery('body').addClass('modal-open');
      },200);
    });
  }

  // getAllPlans() {
  //   let self = this;
  //   self.allPlans = [];
  //   self.planFeatures = [];
  //   let getAllPlans = self._membershipService.getPlans()
  //     .subscribe(
  //       (success: any) => {
  //         success.lists.list.forEach((list: any) => {
  //           if (list.plan.id.split('_')[0] === 'freelancer' || list.plan.id.split('_')[0] === 'essentials' || list.plan.id.split('_')[0] === 'business' || list.plan.id.split('_')[0] === 'enterprise') {
  //
  //             if (this.isAppsumoUser && list.plan.id.split('_')[0] != 'freelancer'){
  //               self.allPlans.push(new Plans(list.plan));
  //             }
  //             else if(!this.isAppsumoUser && list.plan.id.split('_')[0] != 'enterprise'){
  //               self.allPlans.push(new Plans(list.plan));
  //             }
  //             if (list.plan.id === 'freelancer_m')
  //               self.freelancer_m_price = list.plan.price / 100;
  //             if (list.plan.id === 'essentials_m')
  //               self.essentials_m_price = list.plan.price / 100;
  //             if (list.plan.id === 'business_m')
  //               self.business_m_price = list.plan.price / 100;
  //             if (list.plan.id === 'enterprise_m')
  //               self.enterprise_m_price = list.plan.price / 100;
  //           }
  //         });
  //         // success.plans.forEach((features: any) => {
  //         //   if (features.plan._id === 'freelancer' || features.plan._id === 'essentials' || features.plan._id === 'business' || features.plan._id === 'enterprise'){
  //         //     if (this.isAppsumoUser && features.plan._id != 'freelancer'){
  //         //       self.planFeatures.push(features);
  //         //     }
  //         //     else if(!this.isAppsumoUser && features.plan._id != 'enterprise'){
  //         //       self.planFeatures.push(features);
  //         //     }
  //         //   }
  //         // });
  //         success.plans.forEach((plan:any)=>{
  //           let plans = {
  //             plan : plan,
  //             current_plan : self.currentPlan_id
  //           }
  //           // self.planFeatures.push(new PlanFeatures(plan));
  //           self.planFeatures.push(new PlanFeatures(plans,self.isAppsumoUser));
  //         });
  //         //console.log("DAHIYAAAAAAAAAAAAAAA",self.planFeatures);
  //         self.getViewPlan();
  //       }, (error: any) => {
  //         getAllPlans.unsubscribe();
  //       }
  //     );
  // }

  getAllPlans(){
    let self = this;
    this.loadingPlans = true;
    let gap = self._membershipService.getPlans()
      .subscribe(
        (success: any) => {
          console.log('uuuuuuuuuuuuuuuuuuuuuu', success);
          self.freelancer_plans = [];
          self.essentials_plans = [];
          self.business_plans = [];
          success.plans.forEach((plan) => {
            if(plan.plan._id === 'freelancer')
              self.freelancer = plan.plan;
            if(plan.plan._id === 'essentials')
              self.essentials = plan.plan;
            if(plan.plan._id === 'business')
              self.business = plan.plan;
          });
          success.lists.list.forEach((plan) => {
            plan.plan.price = Math.ceil(plan.plan.price/100);
            if(plan.plan.id.split('_')[0] == 'freelancer') {
              if(plan.plan.id == 'freelancer_m')
                self.freelancer_m = plan.plan.price;
              if(plan.plan.id == 'freelancer_s')
                plan.plan.price = Math.ceil(plan.plan.price/6);
              if(plan.plan.id == 'freelancer_y')
                plan.plan.price = Math.ceil(plan.plan.price/12);
              self.freelancer_plans.push(plan.plan);
            }
            if(plan.plan.id.split('_')[0] == 'essentials') {
              if(plan.plan.id == 'essentials_m' && !this.isAppsumoUser)
                self.essentials_m = plan.plan.price;
              if(plan.plan.id == 'essentials_s')
                plan.plan.price = Math.ceil(plan.plan.price/6);
              if(plan.plan.id == 'essentials_y')
                plan.plan.price = Math.ceil(plan.plan.price/12);
              self.essentials_plans.push(plan.plan);
            }
            if(plan.plan.id.split('_')[0] == 'business') {
              if(plan.plan.id == 'business_m')
                self.business_m = plan.plan.price;
              if(plan.plan.id == 'business_s')
                plan.plan.price = Math.ceil(plan.plan.price/6);
              if(plan.plan.id == 'business_y')
                plan.plan.price = Math.ceil(plan.plan.price/12);
              self.business_plans.push(plan.plan);
            }
          });
          this.loadingPlans = false;
          gap.unsubscribe();
          self.initJQuery();
        },
        (error: any) => {
          console.log('getAllPlans error', error);
          gap.unsubscribe();
        });
  }
  numberFormat(num:number){
    return NumberFormater.insertCommas(num);
  }


  initJQuery() {
    jQuery(".expand").click( function(event) {
      var $target = jQuery(event.target);
      jQuery(this).toggleClass('open');
      $target.closest(".expand").find(".detail").slideToggle();
    });

    jQuery(".expand-rs").click( function(event) {
      var $target = jQuery(event.target);
      jQuery(this).toggleClass('open');
      jQuery(this).children(".detail").slideToggle();
    });

    jQuery('.expand-all').click( function(event){
      if(jQuery(this).hasClass('open')){
        jQuery('.expand').removeClass('open');
        jQuery(".detail").slideUp("slow");
      }
      else{
        jQuery('.expand').addClass('open');
        jQuery(".detail").slideToggle();
      }
      jQuery(this).toggleClass('open');
    });

    jQuery('.toggle-more').click(function(event){
      var $target = jQuery(event.target);
      var d = jQuery(this).children("i").html();
      if(d === 'add'){
        jQuery(this).children("i").html('remove');
        jQuery(this).children("p").html('show less');
      }
      else{
        jQuery(this).children("i").html('add');
        jQuery(this).children("p").html('show more');
      }
      jQuery(this).parents('.pricing-bottom').toggleClass('open');
      $target.closest(".pricing-bottom").find(".features").slideToggle();
    });
  }

  tabChangeP(cycle){
    console.log('cycle', cycle);
    jQuery('.cycle-tab-p').removeClass('active');
    jQuery('.price-tag-p').css('display', 'none');
    jQuery('#'+cycle).addClass('active');
    jQuery('.'+cycle+'-price-p').css('display', 'block');
  }

  getCompanyFeatures(){
    let self = this;
    self.companyFeature = [];
    let getCompanyFeatures = self._membershipService.getCompanyFeatures()
      .subscribe(
        (success: any) => {
          self.companyFeature = success;
          //console.log('*********awesome***************************',success);
        }, (error: any) => {
          getCompanyFeatures.unsubscribe();
        }
      );
  }

  getPaymentDetails(){
    let getAllPlans = this._membershipService.getPaymentDetails()
      .subscribe(
        (success: any) => {
          let s = {
            cardStatus:success.status
          };
          this.cardStatus = success.status;
          this._cookieService.createCookie('status',JSON.stringify(s),3);
        }, (error: any) => {
          getAllPlans.unsubscribe();
        }
      );
  }

  getViewPlan() {
    let self = this;
    this.viewPlans = [];
    this.allPlans.forEach((plan) => {
      if (plan.id.split('_')[1] === this.cycle)
        this.viewPlans.push(plan);
    });
    setTimeout(function() {
      jQuery(self.seletedFeature).addClass('activegreen limited-label');
    }, 200);
  }

  cycleChange(cycle: string) {
    this.seletedFeature = '.'+this._featureAuthService.selectedFeature;
    jQuery('.plan-cycle').removeClass('active');
    jQuery('#' + cycle).addClass('active');
    this.cycle = cycle;
    this.getViewPlan();
  }

  callGA(str: any) {
    switch (str) {
      case "UPGRADE":
        ga('markettingteam.send', 'event', 'UpgradeNow', 'Click', 'Upgradepopup');
        // _kmq.push(['record', 'Upgrade popup click']);
        break;
      case "LATER":
        this.updateStorage();
        ga('markettingteam.send', 'event', 'UpgradeLater', 'Click', 'Upgradepopup');
        // _kmq.push(['record', 'Upgrade later link click']);
        break;
    }
  }

  ngAfterViewInit() {
    jQuery("#toggle-dots-white1").click(function(){
			jQuery("#billing-grey-bottom1").slideToggle('slow');
		});

		jQuery(".toggle-dots-grey").click(function(){
			jQuery(".billing-white-bottom").slideToggle('slow');
		});

    jQuery("#toggle-dots-white2").click(function(){
			jQuery("#billing-grey2").slideToggle('slow');
		});

    jQuery("#slideshow > div:gt(0)").hide();

    setInterval(function() {
      jQuery('#slideshow > div:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slideshow');
    }, 3000);
  }

  updateStorage() {
    let storage = JSON.parse(this._cookieService.readCookie('storage'));
    if (storage.showUpgradeModal) {
      storage.showUpgradeModal = false;
      this._cookieService.createCookie('storage', JSON.stringify(storage), 3);
    }
  }

  closePremModal() {
    this.callGA('UPGRADE');
    jQuery('#premiumModal').modal('hide');
  }

  toCeil(pr: number) {
    return Math.ceil(pr);
  }

  upgradeEstimate(plan: Plans) {
    this.selectdePlan = plan;
    this.loading = true;
    this.error = false;
    jQuery('.modal-backdrop').remove();
    jQuery('#estimate-popup').modal('show');
    jQuery('.modal-backdrop:not(.added)').insertAfter('#estimate-popup');
    this.subscriptionEstimate(plan);
  }
  closeUpgrade(){
    jQuery('#estimate-popup').modal('hide');
    jQuery('.modal-backdrop').insertAfter('#premiumModal');
    jQuery('.modal-backdrop').remove();
  }
  closeCC(){
    jQuery('#cc-modal-premium').modal('hide');
    setTimeout(function(){
      jQuery('body').addClass('modal-open');
    },1000);
    jQuery('.modal-backdrop').insertAfter('#premiumModal');
  }

  subscriptionEstimate(plan: Plans) {
    this.selectdePlan = plan;
    this.loading = true;
    this.error = false;
    this.couponCode = '';
    if (jQuery('#couponInput:text').val()) {
      this.couponCode = this.couponForm.value.couponInput.trim().toUpperCase();
      this.couponCodeModal = '';
    }
    if(this.isAppsumoUser && plan.id.split('_')[0] == "essentials"){
      this.couponCode = "APPSUMODEAL"+plan.id.split('_')[1].toUpperCase();
    }
    // if(this.couponCode.indexOf('APPSUMO') === 0 || this.couponCode === '') {
      let data = {
        'plan_id': plan.id,
        'prorate': true,
        'end_of_term': false
      };
      if (this.couponCode !== '')
        data['coupon'] = this.couponCode;
      let self = this;
      self.couponOffer = null;
      self.couponDiscount = null;
      let subscriptionEstimate = self._membershipService.getUpdateEstimate(data)
        .subscribe(
          (success: any) => {
            if (success.coupon) {
              self.couponOffer = success.coupon;
              self.couponDiscount = self.couponOffer.discount;
            }
            self.estimation = new Estimate(success.estimate);
            self.loading = false;
            this.error = false;
            this.errorMessage = '';
            self.invoiceEstimate = self.estimation.next_invoice_estimate ? self.estimation.next_invoice_estimate : self.estimation.invoice_estimate;
            let c = self.invoiceEstimate.line_items[0].entity_id.split('_')[1];
            if (c === 'm')
              self.billingCycle = 'Monthly';
            else if (c === 's')
              self.billingCycle = 'Semi Annual';
            else if (c === 'y')
              self.billingCycle = 'Annual';
          },
          (error: any) => {
            this.error = true;
            if (error.error.err_message.indexOf('subscription[coupon]') != -1)
              this.errorMessage = 'Invalid Coupon ' + this.couponCode;
            else
              this.errorMessage = error.error.err_message;
            self.loading = false;
            self.couponCode = '';
            subscriptionEstimate.unsubscribe();
          }
        );
    // }
    // else{
    //   this.error = true;
    //   this.errorMessage = 'Invalid Coupon ' + this.couponCode;
    //   this.couponCode = '';
    //   this.loading = false;
    // }
  }

  cancelCoupon(plan: Plans) {
    this.couponCode = '';
    this.subscriptionEstimate(plan);
  }

  makePayment() {
    if (this.cardStatus !== 'valid' && this.invoiceEstimate.total > 0) {
      jQuery('#estimate-popup').modal('hide');
      setTimeout(function() {
        jQuery('#cc-modal-premium').modal('show').insertAfter('#estimate-popup');
        jQuery('.modal-backdrop').insertAfter('#cc-modal-premium');
      }, 1000);
    }else{
      this.changeSubscription();
    }
  }

  changeSubscription(){
    let data = {
      'billing': {
        "plan_id": this.selectdePlan.id,
        "prorate": true,
        "end_of_term": false,
      }
    };
    if (this.couponCode !== '')
      data['billing']['coupon'] = this.couponCode;
    let self = this;
    jQuery('#btnMakePayment').html('please Wait...').attr('disabled',true);
    let changeSubscription = self._membershipService.updateSubscription(data)
      .subscribe(
        (success: any) => {
          //refreshing features
          jQuery('#estimate-popup').modal('hide');
          this.error = false;
          this.errorMessage = '';
          this.currentCompany = this._subDomainService.currentCompany  = new CurrentCompany(success.company);
          this._subDomainService.subDomain.sub_domain = this.currentCompany.sub_domain;
          this._subDomainService.subDomain.company_id = this.currentCompany.id;
          this._subDomainService.subDomain.name = this.currentCompany.name;
          let membership = JSON.parse(this._cookieService.readCookie('filepicker_token_json'));
          for(let i=1;i<membership.length;i++){
            if(membership[i].key === success.company.sub_domain){
              membership[i].value = success.subscription.status;
            }
          }
          this._cookieService.eraseCookie('filepicker_token_json');
          this._cookieService.createCookie('filepicker_token_json',JSON.stringify(membership),3);
          window.toastNotification('Plan Changed Successfully');
          window.location.reload();
        },
        (error:any) => {
          this.error = true;
          jQuery('#btnMakePayment').html('Make Payment').attr('disabled',false);
          this.errorMessage = error.error.err_message;
          changeSubscription.unsubscribe();
        }
      );
  }

  expand(pId:any){
    if(jQuery('#'+pId).hasClass('rs-hide')) {
      jQuery('#' + pId).removeClass('rs-hide');
      jQuery('#' + pId + '_arrow').html('keyboard_arrow_up');
      jQuery('#' + pId + '_more').html('Less Info');
    }
    else {
      jQuery('#' + pId).addClass('rs-hide');
      jQuery('#' + pId + '_arrow').html('keyboard_arrow_down');
      jQuery('#' + pId + '_more').html('More Info');
    }
  }

  onChangeCardNumber(cardNum:any){
    let self = this;
    jQuery(cardNum).validateCreditCard(function(result:any) {
      if(result.card_type != null){
        self.cardType = result.card_type.name;
        if(result.length_valid && result.luhn_valid && result.valid)
          self.cardValid = true;
      }
    });
    var pattern = /[a-z\s',\."/{}()[\]]/gi;
    var stringnumber = cardNum.value.replace(pattern,'');
    cardNum.value = stringnumber;
    if(cardNum.value.length === 4){
      jQuery(cardNum).next('input').focus();
    }
  }

  setupMakePayment(){
    let cardData = {
      'cardNumber':this.setupPaymentPremium.value.cardNumber1
      + this.setupPaymentPremium.value.cardNumber2
      + this.setupPaymentPremium.value.cardNumber3
      + this.setupPaymentPremium.value.cardNumber4,
      'cvv':this.setupPaymentPremium.value.cvv,
      'cardMonth':this.setupPaymentPremium.value.cardMonth,
      'cardYear':this.setupPaymentPremium.value.cardYear,
    };
    this.error = false;
    this.errorMessage = '';
    let self = this;
    jQuery('#btnSetupCard span').text('Please wait...').attr('disabled',true);
    let setupPayment = self._membershipService.resetPayment(cardData)
      .subscribe(
        (success: any) => {
            jQuery('#btnSetupCard span').text('Make Payment').attr('disabled',false);
          self.cardType = '';
          self.cardValid = false;
          // this.CardDetail = new Card(success.card);
          // this.card_status = success.customer.card_status;
          this.error = false;
          this.errorMessage = '';
          self.changeSubscription();
          /*---- Tracking code goes here ----*/
          /*if(window.location.href.indexOf('outgrow.co') >= 0) {
           fbq('track', 'AddPaymentInfo');
           }*/
          ga('markettingteam.send', 'event', 'Settings', 'Submit', 'Settings Add Payment Method');
          // _kmq.push(['record', 'Settings Payment Method Added']);
          /*---------------------------------*/
        },
        (error:any) => {
            jQuery('#btnSetupCard span').text('Make Payment').attr('disabled',false);
          this.error = true;
          this.errorMessage = error.error.err_message;
          setupPayment.unsubscribe();
        }
      );
  }

  upgradePlanSlide(){
    jQuery('#premiumModal').animate({
      scrollTop: jQuery('#plansList').offset().top
    }, 1000);
  }
  contactUs(){
    jQuery(document).find('.intercom-launcher').click();
  }
}

