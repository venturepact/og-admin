import { Component, OnInit, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder ,Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {Card} from './../models/currentPlan';
import {environment} from '../../../environments/environment';
import {MembershipService} from '../services/membership.service';
import {CookieService} from '../services/cookie.service';
import {Script} from '../services/script.service';
declare var jQuery:any;
declare var ga:any;
// declare var _kmq:any;
declare var window: any;

@Component({
  selector: 'og-payment-modal',
  templateUrl: './paymentModal.component.html',
  styleUrls: ['./paymentModal.component.css']
})

export class PaymentModalComponent implements OnInit, AfterViewInit{
  setupPaymentForm:FormGroup;
  cardType: string = '';
  cardValid:boolean = false;
  error:boolean = false;
  errorMessage: string = '';
  errormsg:string ='';
  errorcard:boolean = false;
  CardDetail: Card = new Card(null);
  card_status:string = '';
  isChangePlan:boolean = false;
  username:string;
  cardStatus:string = '';
  subsStatus:string = '';
  payment_left : number = 0;
  ogExt:string = '';
  @Output() notify = new EventEmitter();
  ngOnInit(){
    this.errorMessage = '';
    this.errormsg = '';
    this.error = false;
    this.errorcard = false;
    this.setupPaymentForm = this.fb.group({
      cardNumber1 : ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      cardNumber2 : ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      cardNumber3 : ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      cardNumber4 : ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      nameOnCard : ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cvv : ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(4),Validators.pattern('^[0-9]*$') ])],
      cardMonth: ['', Validators.compose([Validators.minLength(1),Validators.pattern('^[0-9]*$')])],
      cardYear: ['', Validators.compose([Validators.pattern('^[0-9]*$')])]
    });
    jQuery('.modal').on('hidden.bs.modal', function(){
      this.errorMessage = '';
      this.error = 'false';
    });
    let planSubs = this._membershipService.getplanSubscription()
      .subscribe(
        (success:any)=>{
          this.payment_left = success.currentplan.subscription.plan_unit_price/100;
        },
        (error:any)=>{
          planSubs.unsubscribe();
        }
      );
    let storage : any = this._cookieService.readCookie('storage');
      if (storage) {
        storage = JSON.parse(storage);
        this.username = storage.user.name;
      }

    let status: any = this._cookieService.readCookie('status');
    if(status){
      status = JSON.parse(status);
      this.cardStatus = status.cardStatus;
      this.subsStatus = status.subsStatus;
    }

    this.ogExt = environment.APP_EXTENSION;
  }
  constructor(
    public fb : FormBuilder,
    public _membershipService : MembershipService,
    public _script:Script,
    public _cookieService : CookieService,
    public router: Router,
  ) {

  }

  onChangeCardNumber(cardNum:any){
    let self = this;
    jQuery('#cardNumber1').validateCreditCard(function(result:any) {
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

  ngAfterViewInit() {
      this._script.load('cardValidator')
        .then((data)=>{
          //console.log('Scripts Loaded', data);
        })
        .catch((error)=>{
          //console.log('Script failed to load',error);
        });
  }

  setup(){
    this.error      =  false;
    this.errorMessage = '';
    jQuery('#new-setup-payment').modal('hide');
    jQuery('#cc-modal-payment').modal({backdrop: 'static', keyboard: false});
    jQuery('#cc-modal-payment').modal('show');
  }

  setupPayment(){
    this.errorcard = false;
    let cardData = {
      'cardNumber':this.setupPaymentForm.value.cardNumber1
      + this.setupPaymentForm.value.cardNumber2
      + this.setupPaymentForm.value.cardNumber3
      + this.setupPaymentForm.value.cardNumber4,
      'cvv':this.setupPaymentForm.value.cvv,
      'cardMonth':this.setupPaymentForm.value.cardMonth,
      'cardYear':this.setupPaymentForm.value.cardYear,
    };
    this.error = false;
    this.errorMessage = '';
    let self = this;
    jQuery('#btnSetupCard').html('Please wait...').attr('disabled',true);
    let setupPayment = self._membershipService.resetPayment(cardData)
      .subscribe(
        (success: any) => {
          self.cardType = '';
          self.cardValid = false;
          if (this.subsStatus === 'cancelled') {
            this.activateNow();
          }else {
            //console.log(success);
            let status = JSON.parse(this._cookieService.readCookie('status'));
            status.cardStatus = success.customer.card_status;
            this._cookieService.createCookie('status',JSON.stringify(status),3);
            this.CardDetail = new Card(success.card);
            this.card_status = success.customer.card_status;
            this.error = false;
            this.errorMessage = '';
            jQuery('#cc-modal-payment').modal('hide');
            jQuery('.modal-backdrop').remove();
            jQuery('#premiumPaymentModal').modal('hide');
            this.errorMessage = '';
            window.toastNotification('Payment details added successfully');
            self._cookieService.createCookie('cardStatus',self.card_status,3);
            // window.location.reload();
            let url = this.router.url.split('/')[1];
            if(localStorage.getItem('openpopup') === 'true'){
              this.notify.emit({
                data:success
              })
              return;
            }

            this.router.navigate(['/settings/membership']);

          }
          jQuery('#btnSetupCard').html('Submit').attr('disabled',false);
          jQuery('#cc-modal-payment input').val('');
          /*---- Tracking code goes here ----*/
            ga('markettingteam.send', 'event', 'Settings', 'Submit', 'Settings Add Payment Method');
            // _kmq.push(['record', 'Settings Payment Method Added']);
            /*---------------------------------*/
        },
        (error:any) => {
          this.error = true;
          this.errorMessage = 'Invalid card details';
          if(this.isChangePlan)
            jQuery('#btnSetupCard').html('Make Payment').attr('disabled',false);
          else
            jQuery('#btnSetupCard').html('Submit').attr('disabled',false);
          setupPayment.unsubscribe();
        }
      );
  }

  activateNow(){
    let self = this;
    this.errorcard  = false;
    this.error      =  false;
    jQuery('.btnActivateNow').html('Please wait...').attr('disabled',true);
    self._membershipService.activateNow()
      .subscribe(
        (success: any) => {
          //console.log('activated',success);
          let status = {
              cardStatus: 'valid',
              subsStatus: success.subscription.status,
          };
          window.toastNotification('Payment successfull');
          let membership = JSON.parse(this._cookieService.readCookie('filepicker_token_json'));
					membership[1].value = success.subscription.status;
					this._cookieService.eraseCookie('filepicker_token_json');
					this._cookieService.createCookie('filepicker_token_json',JSON.stringify(membership),3);
          jQuery('#btnActivateNow').html('Activate Now').attr('disabled',false);
          this._cookieService.createCookie('status',JSON.stringify(status),3);
          jQuery('.modal-backdrop').remove();
          jQuery('#new-setup-payment').modal('hide');
          jQuery('#cc-modal-payment').modal('hide');
          window.location.reload();
        },
        (error:any) => {
            this.errorcard  = true;
            this.error      =  true;
            this.errorMessage = error.error.err_message;//'Subscription cannot be re-activated as your card is decline';
            jQuery('.btnActivateNow').html('Make Payment').attr('disabled',false);
        }
      );
  }
}
