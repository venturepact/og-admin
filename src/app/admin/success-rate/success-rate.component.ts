import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {Datatable} from "../../shared/interfaces/datatable.interface";
import {Script} from "../../shared/services/script.service";
import {FormControl} from "@angular/forms";
import "rxjs/Rx";
import {AdminService} from "../../shared/services/admin.service";
import {MembershipService} from "../../shared/services/membership.service";
import {Subscription} from "rxjs";
import {CookieService} from "../../shared/services/cookie.service";

declare var moment: any;
declare var jQuery: any;

@Component({
  selector: 'og-success-rate',
  templateUrl: './success-rate.component.html',
  styleUrls: ['./success-rate.component.css']
})
export class SuccessRateComponent extends Datatable implements OnInit, AfterViewInit, OnDestroy {

  loading = false;
  paymentLoading = false;
  trialStatusLoading = false;
  showAdvancedFilter = false;
  toStr = JSON.stringify;

  company: Array<any> = [];
  input = new FormControl();

  isInvoiceExist = false;
  invoices: any = [];
  invoiceNo: any;

  sortKey = '_id'; // default sort parameters
  sortOrder = -1; // -1 for ascending order

  currentSelectedFilter: any = "";
  filters: Array<any> = []; // represents each filter
  savedFilters: Array<any> = [];
  filtersPostData: Array<any> = [];
  stringOperators = ['contains', 'does not contain', 'equals', 'not equal to', 'starts with'];
  numberOperators = ['between', 'less than', 'greater than', 'equals'];

  filter = {
    company: [{name: 'name', type: 'string'}, {name: 'leads', type: 'number'},
      {name: 'visits', type: 'number'}, {name: 'sign_up', type: 'date'}, {name: 'plan', type: 'string'},
      {name: 'appsumo_created', type: 'bool'}],

    app: [{name: 'name', type: 'string'}, {name: 'status', type: 'string'},
      {name: 'created_at', type: 'date'}, {name: 'latest_publish', type: 'date'}],

    operators: {
      leads: this.numberOperators, visits: this.numberOperators, name: this.stringOperators,
      sign_up: this.numberOperators, appsumo_created: ['equals', 'not equal to'],
      plan: this.stringOperators, status: this.stringOperators,
      created_at: this.numberOperators, latest_publish: this.numberOperators
    },
    selected_property: 'name', // initially select name
    selected_operator: '',
    select_property_type: '',
    visible: true
  }; // model for a single filter

  public subscriptions: Subscription = new Subscription();
  public sub_role: String = null;

  constructor(public _script: Script, public adminService: AdminService,
              public _membershipService: MembershipService, public _cookieService: CookieService) {
    super();

    if (_cookieService.readCookie('storage')) {
      let storage = JSON.parse(_cookieService.readCookie('storage'));
      this.sub_role = storage.user.sub_role;
    }
  }

  ngOnInit() {
    this.addFilter();

    this.loading = true;
    this.subscriptions.add(this.input.valueChanges.debounceTime(1500).distinctUntilChanged()
      .switchMap(data => {
        super.searchData();
        return this.searchData();
      })
      .subscribe((response) => {
        this.updateCompanySuccessRate(response);
      }, err => this.loading = false));
  }

  ngAfterViewInit() {
    this._script.load('datatables', 'daterangepicker')
      .then((data) => {
      }).catch((error) => {
      console.log('Script not loaded', error);
    });
  }

  addFilter() {
    this.filters.push(JSON.parse(JSON.stringify(this.filter))); // passing filter by value
    this.filtersPostData.push({}); // initialize an empty request object
  }

  removeFilter(index) {
    this.filters[index].visible = false;
    this.filtersPostData[index] = {};
  }

  onSavedFilterChange() {
    let filter = JSON.parse(this.currentSelectedFilter.filter_string);
    this.filters = [];
    filter.forEach((value, index) => {
      this.addFilter();
      this.filters[index].selected_property = value.property;
      this.filters[index].select_property_type = value.type;
      this.filters[index].selected_operator = value.operator;

      //set post data
      this.filtersPostData[index]['property'] = value.property;
      this.filtersPostData[index]['type'] = value.type;
      this.filtersPostData[index]['operator'] = value.operator;
    });

  }

  setFilterProperty(target, index) {

    this.filtersPostData[index]['property'] = this.filters[index].selected_property;
    let type = target.options[target.options.selectedIndex].className;
    this.filtersPostData[index]['type'] = type;
    this.filters[index].select_property_type = type;

    this.filters[index].selected_operator = ''; // reset operator value
  }

  setFilterOperator(value, index) {
    this.filtersPostData[index]['operator'] = value;
    this.filters[index].selected_operator = value;
  }

  setFilterValue(value, index) {
    this.filtersPostData[index]['value'] = [];
    this.filtersPostData[index]['value'][0] = value;
  }

  setDateStart(date: any, index) {
    this.filtersPostData[index]['value'] = [];
    this.filtersPostData[index]['value'][0] = date.start_date;
  }

  setDateRange(date: any, index) {
    this.filtersPostData[index]['value'] = [];
    this.filtersPostData[index]['value'][0] = date.start_date;
    this.filtersPostData[index]['value'][1] = date.end_date;
  }

  getRequestParams(): any {
    return {
      limit: this.current_limit,
      page: this.current_page - 1,
      search_key: this.search,
      sort_order: this.sortOrder,
      sort_key: this.sortKey,
      filter: this.parseFilterData()
    };
  }

  parseFilterData() {
    // filter empty objects
    let filteredData = this.filtersPostData.filter(value => {
      return !(Object.keys(value).length === 0);
    });

    // group by types - {app:[],company:[]}
    let groupedByData = {};
    for (let i = 0; i < filteredData.length; i++) {
      let current = filteredData[i];

      if (groupedByData[current.type] === undefined) {
        groupedByData[current.type] = [];
      }
      groupedByData[filteredData[i].type].push(current);
    }

    return groupedByData;
  }

  filterResults() {
    super.searchData();
    this.getCompanySuccessData();
  }

  getCompanySuccessData() {
    this.loading = true;

    this.subscriptions.add(this.adminService.getCompanySuccessRate(this.getRequestParams())
      .subscribe((response) => {
        this.updateCompanySuccessRate(response);
      }, err => this.loading = false));
  }

  getPaymentsInfo(companyId) {
    this.paymentLoading = true;
    // get invoices
    this.getInvoices(companyId);
  }

  sort(columnSortKey) {
    this.sortKey = columnSortKey;
    if (this.sortOrder === -1) {
      this.sortOrder = 1;
    } else {
      this.sortOrder = -1;
    }

    super.searchData();
    this.getCompanySuccessData();
  }

  toggleCompanyDetails(company: any) {
    company.showDetails = !company.showDetails;
  }

  showFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
    this.adminService.getSavedFilters().subscribe(filters => {
      this.savedFilters = filters;
    })
  }

  updateCompanySuccessRate(response: any) {
    this.trialStatusLoading = true;

    this.company = response.successRate;
    let companyIds: Array<any> = [];

    for (let i = 0; i < this.company.length; i++) {
      this.company[i].created_at = moment(this.company[i].createdAt).fromNow().trim();
      companyIds.push(this.company[i]._id);
    }
    this.total_pages = Math.ceil(response.count / this.current_limit);
    this.loading = false;

    if (this.company.length > 0) {

      this.subscriptions.add(this.adminService.getCompaniesTrialStatus({company_ids: companyIds})
        .subscribe(data => {
          for (let i = 0; i < data.length; i++) {
            let index = this.company.findIndex((value) => {
              if (value._id === data[i].company_id) {
                return true;
              }
            });
            this.company[index].trial_status = data[i].trial_status;
            this.trialStatusLoading = false;
          }
        }, (err) => {
          this.trialStatusLoading = false;
          for (let i = 0; i < this.company.length; i++) {
            this.company[i].trial_status = 'error';
          }
        }));
    }
  }

  saveFilter(filterName, filterDescription) {
    let filteredData = this.filtersPostData.filter(value => {
      return !(Object.keys(value).length === 0);
    });

    let postData = {
      name: filterName.value,
      description: filterDescription.value,
      filterString: JSON.stringify(filteredData)
    };
    this.adminService.saveSuccessRateFilter(postData).subscribe(response => {
      jQuery("#saveFilterModal").modal("hide");
      filterName.value = '';
      filterDescription.value = '';
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getInvoices(companyId) {
    this.invoices = [];
    this.invoiceNo = 0;
    this._membershipService.getInvoices(companyId)
      .subscribe(
        (invoices: any) => {
          this.paymentLoading = false;
          invoices.list.forEach((invoiceList: any) => {
            this.invoiceNo++;
            invoiceList.invoice.invoiceNo = this.invoiceNo;
            this.isInvoiceExist = true;
            // console.log(invoiceList.invoice.id, 'invoice');
            this._membershipService.getInvoicesPdf(invoiceList.invoice.id, companyId)
              .subscribe(
                (data: any) => {
                  // console.log('Get Pdf', data);
                  invoiceList.invoice.href = data.download.download_url;
                  invoiceList.invoice.date = moment.unix(invoiceList.invoice.date).format('DD-MM-YYYY');
                },
                (error: any) => {
                  console.log('Issue in pdf', error);
                }
              );
            this.invoices.push(invoiceList.invoice);
          });
        },
        (error: any) => {
          console.log('Error in getting invoices', error);
        }
      );
  }

  paging(num: number) {
    super.paging(num);
    this.getCompanySuccessData();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getCompanySuccessData();
  }

  previous() {
    super.previous();
    this.getCompanySuccessData();
  }

  next() {
    super.next();
    this.getCompanySuccessData();
  }

  searchData() {
    this.loading = true;
    super.searchData();
    return this.adminService.getCompanySuccessRate(this.getRequestParams());
  }
}
