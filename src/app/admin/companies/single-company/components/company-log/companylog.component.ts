import {OnInit, Component, AfterViewInit, Input} from '@angular/core';
import {AdminService} from './../../../../../shared/services/admin.service';
import {Datatable} from "../../../../../shared/interfaces/datatable.interface";
import {Script} from "../../../../../shared/services/script.service";
import {ActivatedRoute} from "@angular/router";

declare var jQuery: any;
declare var moment: any;
declare var google: any;

@Component({
  selector: 'company-log',
  templateUrl: './companylog.component.html',
  styleUrls: ['./companylog.css']
})
export class CompanylogComponent extends Datatable implements OnInit, AfterViewInit{
  @Input() company: any;
  subAdminId: String;
  loading: Boolean = true;
  subAdminLogs: any = [];
  constructor(private _adminService: AdminService,
              private _script: Script,
              private route: ActivatedRoute) {
    super();
    this.route.params.subscribe(params => {
      this.subAdminId = params['id'];
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
      console.log(this.company,"papai");
    this._script.load('datatables')
      .then((data) => {
        this.getCompanyLogs();
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });

    jQuery('.modal').on('hidden.bs.modal', function () {
      this.error = false;
      this.errorMessage = '';
    });
  }

  getCompanyLogs(){
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search
    };
    let self  = this;
    self.subAdminLogs = [];
    self.loading = true;
    let getAllAdminLogs = self._adminService.getAllAdminLogs(this.company.id, obj)
      .subscribe(
        (success: any) => {
          self.subAdminLogs = success.log;
          this.total_pages = Math.ceil(success.count / this.current_limit);
          self.loading = false;
        },
        (error: any) => {
          console.log('subadminlog e', error);
        }
      );
  }

  paging(num: number) {
    super.paging(num);
    this.getCompanyLogs();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getCompanyLogs();
  }

  previous() {
    super.previous();
    this.getCompanyLogs();
  }

  next() {
    super.next();
    this.getCompanyLogs();
  }

  searchData() {
    super.searchData();
    this.getCompanyLogs();
  }
  dateFormat(date: any) {
    let d = new Date(date);
    return d.toString().split('GMT')[0];
  }
}
