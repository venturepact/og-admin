import { Component, OnInit , OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { Datatable } from '../../shared/interfaces/datatable.interface';
import {Script} from '../../shared/services/script.service';
import { AdminService } from '../../shared/services/admin.service';
@Component({
  selector: 'app-custom-js-approvals',
  templateUrl: './custom-js-approvals.component.html',
  styleUrls: ['./custom-js-approvals.component.css']
})
export class CustomJsApprovalsComponent extends Datatable implements OnInit, OnDestroy {
  loading: Boolean = true;
  data: any;
  selected:any;
  error:any;
  selectedStatus: String;
  $listSubscriber: any;
  $setSetterSubscription: any;
  @ViewChild('txt') comments: ElementRef;
  constructor(public _adminService: AdminService) {
     super();
  }

  ngOnInit() {
    this.selectedStatus = 'PENDING';
    this.getList();
  }
  getList(){
     let obj = {
        limit: this.current_limit,
        page: this.current_page - 1,
        searchKey: this.search,
        status: this.selectedStatus
      };
    this.$listSubscriber = this._adminService.getCustomJSApprovalsList(obj).subscribe((response) => {
        //console.log('response', response);
        this.loading = (response) ? false : true;
        this.data = response;
    });
  }
  setStatus(selected: any,scriptStatus: String, comments: String) {
    let prettyComment = selected['custom_script'].comments + ` \n Commented On: ${this.dateFormat(null)} \n ${comments} \n`;
    //console.log("PREVIOUS COMMENTS: ",selected['custom_script'].comments);
    let data = { app_id: selected['_id'],
                 status: scriptStatus, comments: prettyComment,
                 company: selected['company']._id,
                 companyName: selected['company'].name
              };
    this.$setSetterSubscription = this._adminService.setScriptStatus(data).subscribe((response)=>{
      //console.log('Response', response);
      this.selected = {};
      this.getList();
      //console.log("djdjd", this.comments)
      this.comments.nativeElement.value = '';
    });
  }
   dateFormat(date: any) {
    let d =(date)?new Date(date) : new Date();
    return d.toString().split('GMT')[0];
  }
   paging(num: number) {
    super.paging(num);
    this.getList();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getList();
  }

  previous() {
    super.previous();
    this.getList();
  }

  next() {
    super.next();
    this.getList();
  }

  searchData() {
    super.searchData();
    this.getList();
  }
  changed(event:any){
    //console.log("value",this.selectedStatus);
    this.getList();
  }
  ngOnDestroy(){
    (this.$listSubscriber) ? this.$listSubscriber.unsubscribe() : null;
    (this.$setSetterSubscription) ? this.$setSetterSubscription.unsubscribe() : null;
  }
}
