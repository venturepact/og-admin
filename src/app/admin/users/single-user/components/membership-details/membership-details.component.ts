import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MembershipService} from './../../../../../shared/services/membership.service';
import {UserService} from './../../../../../shared/services/user.service';
import {CompanyService} from './../../../../../shared/services/company.service';

declare var jQuery:any;
declare var moment:any;
@Component({
  selector: 'og-membership-details',
  templateUrl: './membership-details.component.html',
  styleUrls: ['./membership-details.component.css'],
})

export class MembershipDetailsComponent implements OnInit {

  @Input() companies : any[];
  companyId : any;
  id : string;
  payment : any;
  plan: any;
  trial_end : string;
  trial_start : string;
  start_date : string;
  end_date : string;
  status : boolean;
  card : any;
  loading:boolean = false;

  isInvoiceExist: boolean = false;
  invoices : any = [];
  invoiceNo : any;
  constructor(public _membershipService:MembershipService,
    public _userService: UserService,
    public route: ActivatedRoute,
    public _companyService : CompanyService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit(){
    this.companyId = this.companies[0]._id;
    this.getPlanSubscription(this.companyId);
    this.getInvoices(this.companyId);
  }



  refreshCompanyDetail(){
    this.loading = true;
    // console.log("changing id ",this.companyId);
    this.getPlanSubscription(this.companyId);
    this.getInvoices(this.companyId);
  }

  getPlanSubscription(id:string){
    this._membershipService.getplanSubscription(id)
       .subscribe((result:any)=>{
        this.plan = result.currentplan.subscription.plan_id;
        this.trial_end = moment.unix(result.currentplan.subscription.trial_end).format('DD-MM-YYYY');
        this.trial_start = moment.unix(result.currentplan.subscription.trial_start).format('DD-MM-YYYY');
        this.start_date = moment.unix(result.currentplan.subscription.started_at).format('DD-MM-YYYY');
        this.card = result.currentplan.card;
        // console.log("plan details",result);
        this.loading = false;
      });
  }

  getInvoices(id:string) {
    let self = this;
    self.invoices = [];
    this._membershipService.getInvoices(id)
          .subscribe(
                  (invoices : any) => {
                    invoices.list.forEach((invoiceList:any) => {
                      self.invoiceNo++;
                      invoiceList.invoice.invoiceNo = self.invoiceNo;
                       self.isInvoiceExist = true;
                        this._membershipService.getInvoicesPdf(invoiceList.invoice.id,id)
                        .subscribe(
                                (data : any) => {
                                  invoiceList.invoice.href = data.download.download_url;
                                  invoiceList.invoice.date = moment.unix(invoiceList.invoice.date).format('DD-MM-YYYY');
                                },
                                (error:any) => {
                                  // console.log('Issue in pdf',error);
                                }
                        );
                       self.invoices.push(invoiceList.invoice);
                    });
                    this.loading = false;
                  },
                  (error:any) => {
                    console.log('get invoice getErrro',error);
                  }
    );
  }

}
