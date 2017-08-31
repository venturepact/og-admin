import { Component, AfterViewInit } from '@angular/core';
import { AdminService } from './../../shared/services/admin.service';
import { Datatable } from '../../shared/interfaces/datatable.interface';
import { FormGroup, FormBuilder ,Validators } from '@angular/forms';
import {Script} from '../../shared/services/script.service';
import {MembershipService} from "../../shared/services/membership.service";
declare var jQuery: any;

@Component({
  selector: 'og-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css', './../ionicons.min.css','./../../../assets/css/sahil-hover.css','./../../../assets/css/custom-material.css'],
})

export class CouponsComponent extends Datatable implements AfterViewInit {
  loading: boolean = false;
  loadingModal:boolean = false;
  edit_coupon:boolean = false;
  status: string = 'active';
  couponcodes: Object = [];
  createCouponsForm:FormGroup;
  editCouponsForm:FormGroup;
  limitedPeriod:boolean = false;
  error: boolean = false;
  Message:string = '';
  planList:any = [];
  viewCouponCB: any = [];
  viewCouponDB: any = [];
  edt_extra_calc:string = '';
  edt_apply_for:string = '';
  delCoupon:any =  '';


  constructor(public _adminService: AdminService,
              public _script: Script,
              public fb : FormBuilder,
              public _membershipService: MembershipService) {
    super();
    this.createCouponsForm = this.fb.group({
      couponName : ['', Validators.compose([Validators.required,Validators.minLength(2)])],
      couponCode : ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.pattern('^[0-9a-zA-Z_%-]*$')])],
      discountType: ['fixed_amount', Validators.compose([Validators.required])],
      discountValue: ['0', Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern('^[0-9]+(\.[0-9]{0,2})?$')])],
      durationType: ['one_time', Validators.compose([Validators.required])],
      durationValue: ['1', Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern('^[0-9]*$')])],
      maxRedem: ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      extra_calc:['1', Validators.compose([Validators.required,Validators.pattern('^[1-9][0-9]*$')])],
      applyFor:['', Validators.compose([Validators.required])],
    });
    this.editCouponsForm = this.fb.group({
      edit_extra_calc:['0', Validators.compose([Validators.required,Validators.pattern('^[0-9]*$')])],
      edit_applyFor:['', Validators.compose([Validators.required])],
    });
  }
  ngAfterViewInit() {
    this._script.load('datatables')
      .then((data) => {
        this.status = 'active';
        this.getCouponsCode();
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });
    this.getPlanList();
  }

  getPlanList() {
    this._membershipService.getPlanList()
      .subscribe((result) => {
        this.planList = [];
        result.list.forEach((plan:any)=>{
          if(plan.plan.id.split('_').length === 2 && (plan.plan.id.split('_')[1] === 'm' || plan.plan.id.split('_')[1] === 's' || plan.plan.id.split('_')[1] === 'y'))
            this.planList.push(plan);
        });
      },(error) => {
        console.log(error, "this is the error in plan lists");
      })
  }

  getCouponsCode() {
    let self = this;
    self.loading = true;
    self.couponcodes = [];
    let obj = {
      limit: self.current_limit,
      page: self.current_page - 1,
      searchKey: self.search,
      status: self.status
    };
    let getPromocodes = self._adminService.getCouponsCode(obj)
      .subscribe(
        (success: any) => {
          self.couponcodes = success.coupons;
          this.total_pages = Math.ceil(success.count / this.current_limit);
          self.loading = false;
        },
        (error: any) => {
          console.log('error getpromocodes', error);
          getPromocodes.unsubscribe();
        }
      );
  }

  createPromo(){
    this.error = false;
    this.Message = '';
    jQuery('#btnCreateCoupon').html('please wait').attr('disabled',true);
    let self = this;
    let coupon = {
      'applyFor' : this.createCouponsForm.value.applyFor,
      'couponCode' : this.createCouponsForm.value.couponCode,
      'couponName' : this.createCouponsForm.value.couponName,
      'discountType' : this.createCouponsForm.value.discountType,
      'discountValue' : parseFloat(this.createCouponsForm.value.discountValue),
      'durationType' : this.createCouponsForm.value.durationType,
      'durationValue' : parseInt(this.createCouponsForm.value.durationValue),
      'extra_calc' : parseInt(this.createCouponsForm.value.extra_calc),
      'maxRedem' : parseFloat(this.createCouponsForm.value.maxRedem)
    }
    // console.log('this.createCouponsForm.value  component',coupon);
    let createPromo = self._adminService.createPromo(coupon)
      .subscribe(
        (success: any) => {
          jQuery('#btnCreateCoupon').html('Create').attr('disabled',false);
          jQuery('#createPromocodeModal').modal('hide');
          jQuery('#createPromocodeModal input').val('');
          self.createCouponsForm.value.couponName = '';
          self.createCouponsForm.value.couponCode = '';
          self.createCouponsForm.value.discountType = 'fixed_amount';
          self.createCouponsForm.value.discountValue = '0';
          self.createCouponsForm.value.durationType = 'forever';
          self.createCouponsForm.value.durationValue = '1';
          self.createCouponsForm.value.maxRedem = '';
          self.createCouponsForm.value.extra_calc = '1';
          self.createCouponsForm.value.applyFor = '';
          self.getCouponsCode();
        },
        (error: any) => {
          console.log('error leads', error);
          this.error = true;
          this.Message = error.error.err_message;
          if(error.error.err_message === 'discount_amount : should not be sent for the discount_type [percentage]')
            this.Message = 'For discount type percentage mimimum discount value must be 0.01';
          createPromo.unsubscribe();
          jQuery('#btnCreateCoupon').html('Create').attr('disabled',false);
        }
      );
  }
  deletePromocodeConfirm(couponCode:any){
    this.delCoupon = couponCode;
    jQuery('#delConfirmdeModal').modal('show');
  }
  deletePromocode(couponId:string){
    jQuery('#btnDelYes').html("Please wait").attr('disabled',true);
    this.error = false;
    this.Message = '';
    let self = this;
    let deletePromocode = self._adminService.deletePromocode(couponId)
      .subscribe(
        (success: any) => {
          jQuery('#btnDelYes').html("Yes").attr('disabled',false);
          jQuery('#delConfirmdeModal').modal('hide');
          this.delCoupon = '';
          self.getCouponsCode();
        },
        (error: any) => {
          jQuery('#btnDelYes').html("Yes").attr('disabled',false);
          this.error = true;
          this.Message = error.error.err_message;
          deletePromocode.unsubscribe();
        }
      );
  }
  viewPromocode(couponId:string){
    this.error = false;
    this.Message = '';
    let self = this;
    this.loadingModal = true;
    jQuery('#viewPromocodeModal').modal('show');
    let viewPromocode = self._adminService.viewPromocode(couponId)
      .subscribe(
        (success: any) => {
          self.viewCouponCB = success.coupon;
          self.viewCouponDB = success.coupon_db;
          // console.log('self.viewCouponDBself.viewCouponDBself.viewCouponDBself.viewCouponDB',self.viewCouponDB);
          self.edt_extra_calc = success.coupon_db.extra_calc;
          self.edt_apply_for = success.coupon_db.apply_for;
          self.loadingModal = false;
        },
        (error: any) => {
          console.log('error leads', error);
          self.loadingModal = false;
          self.error = true;
          self.Message = error.error.err_message;
          viewPromocode.unsubscribe();
        }
      );
  }
  editPromo(){
    this.error = false;
    this.Message = '';
    let self = this;
    jQuery('#btnSaveCoupon').html('Please wait...').attr('disabled',true);
    let editPromo = self._adminService.editPromocode(self.viewCouponDB._id,self.editCouponsForm.value)
      .subscribe(
        (success:any)=>{
          // console.log('editPromo',success);
          self.edit_coupon = false;
          self.viewCouponDB = success;
          jQuery('#btnSaveCoupon').html('Update').attr('disabled',false);
          this.error = false;
          this.Message = '';
          self.getCouponsCode();
        },
        (error:any)=>{
          console.log('error leads', error);
          self.error = true;
          self.Message = error.error.err_message;
          jQuery('#btnSaveCoupon').html('Update').attr('disabled',false);
          editPromo.unsubscribe();
        }
      );
  }
  DurationType(type:string){
    if(type === 'limited_period')
      this.limitedPeriod = true;
    else {
      this.limitedPeriod = false;
      this.createCouponsForm.value.durationValue = '';
    }
  }
  DiscountType(type:string){
    if(type === 'fixed_amount') {
      jQuery('#discountValueSpan').html('USD');
      jQuery('#discountTypeNote').html('The specified amount will be given as discount.');
    }
    else{
      jQuery('#discountValueSpan').html('%');
      jQuery('#discountTypeNote').html('The specified percentage will be given as discount.');
    }
  }
  NameChange(){
    this.createCouponsForm.value.couponCode = this.createCouponsForm.value.couponName.replace(/[\s]/g, '').toUpperCase();
    //console.log('this.createCouponsForm.value.couponName',nam);
  }
  paging(num: number) {
    super.paging(num);
    this.getCouponsCode();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getCouponsCode();
  }
  statusChange(event: any){
    this.status = event.target.value;
    this.getCouponsCode();
  }

  previous() {
    super.previous();
    this.getCouponsCode();
  }

  next() {
    super.next();
    this.getCouponsCode();
  }

  searchData() {
    super.searchData();
    this.getCouponsCode();
  }
  editCouponCode(id:string){
    console.log('id',id);
  }
}
