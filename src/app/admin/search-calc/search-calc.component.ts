import {AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation} from "@angular/core";
import {Datatable} from "../../shared/interfaces/datatable.interface";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {AdminService} from "../../shared/services/admin.service";
import {Script} from "../../shared/services/script.service";
import {CookieService} from "../../shared/services/cookie.service";

declare var moment;
declare var jQuery;

@Component({
  selector: 'og-search-calc',
  templateUrl: './search-calc.component.html',
  styleUrls: ['./search-calc.component.css',
    '../../site/components/+analytics/assets/css/daterangepicker.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchCalcComponent extends Datatable implements OnInit, OnDestroy, AfterViewInit {

  apps: Array<any> = [];
  loading = false;
  scriptLoaded = false;
  selectedFilter: any;
  showAdvancedFilter = false;
  analyticsUpdateStatus = "";
  value: any;
  createdAtFilter: any = {
    start_date: moment("1970-01-01").format('YYYY-MM-DD'), //start of time
    end_date: moment().add(1, 'day').format('YYYY-MM-DD')
  };
  sortKey = '_id'; // default sort parameters
  sortOrder = -1; // -1 for ascending order

  searchCalc = new FormControl();
  public subscriptions: Subscription = new Subscription();
  public sub_role: String = null;

  constructor(public adminService: AdminService, public scriptService: Script, public _cookieService: CookieService) {
    super();

    if (_cookieService.readCookie('storage')) {
      let storage = JSON.parse(_cookieService.readCookie('storage'));
      this.sub_role = storage.user.sub_role;
    }
  }

  ngOnInit() {
    this.subscriptions.add(this.searchCalc.valueChanges.debounceTime(1500).distinctUntilChanged()
      .switchMap(input => {
        super.searchData();
        return this.searchData();
      }).subscribe((data: any) => {
        this.showApps(data);
      }, err => {
        this.loading = false
      }));
  }

  ngAfterViewInit(): void {
    this.scriptService.load('daterangepicker', 'datatables')
      .then((data) => {
        this.scriptLoaded = true;
      })
      .catch((error) => {
        console.log('script load error', error);
      });
  }

  filterResults() {
    super.searchData();
    this.searchApps();
  }

  searchApps(): any {
    this.searchData().subscribe((response: any) => {
      this.showApps(response);
    }, err => {
      this.loading = false
    });
  }

  getParams(): any {
    return {
      limit: this.current_limit,
      search_key: this.search,
      page: this.current_page - 1,
      filter: this.selectedFilter,
      created_at_filter: this.createdAtFilter,
      sort_key: this.sortKey,
      sort_order: this.sortOrder
    };
  }

  onDateSelect(date: any) {
    this.createdAtFilter.start_date = date.start_date;
    this.createdAtFilter.end_date = date.end_date
  }

  showApps(response: any) {
    this.apps = response.apps;
    this.total_pages = Math.ceil(response.count / this.current_limit);

    for (let i = 0; i < this.apps.length; i++) {
      this.apps[i].createdAt = moment(this.apps[i].createdAt).fromNow().trim();
      this.apps[i].updatedAt = moment(this.apps[i].updatedAt).fromNow().trim();
      if (this.apps[i].analytics) {
        this.apps[i].analytics.updatedAt = moment(this.apps[i].analytics.updatedAt).fromNow().trim();
      }
      else {
        this.apps[i].analytics = {};
        this.apps[i].analytics['updatedAt'] = 'Not Modified';
      }
    }
    this.loading = false;
  }

  sort(columnSortKey) {
    this.sortKey = columnSortKey;
    if (this.sortOrder === -1) {
      this.sortOrder = 1;
    } else {
      this.sortOrder = -1;
    }
    super.searchData();
    this.searchApps();
  }

  updateAnalytics() {
    this.adminService.updateAppsAnalytics().subscribe(data =>
      this.analyticsUpdateStatus = "success", err => this.analyticsUpdateStatus = "failed");
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  paging(num: number) {
    super.paging(num);
    this.searchApps();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.searchApps();
  }

  previous() {
    super.previous();
    this.searchApps();
  }

  next() {
    super.next();
    this.searchApps();
  }

  searchData() {
    this.loading = true;
    return this.adminService.getApps(this.getParams());
  }
}
