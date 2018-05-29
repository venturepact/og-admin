import {AfterViewInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {CompanyService} from './../../../shared/services/company.service';
import {Script} from './../../../shared/services/script.service';
import {Datatable} from '../../../shared/interfaces/datatable.interface';

declare var jQuery: any;
declare var window: any;

@Component({
  selector: 'og-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.css', './../../ionicons.min.css'],
})

export class AllCompaniesComponent extends Datatable implements AfterViewInit {
  data: Array<any> = [];
  loading: boolean = false;
  companyType: string = 'all';
  isSmartTemplate: boolean = false;
  filters: any = [];
  Plans: any = [];
  showAdvancedFilter:boolean=false;
  totalCompanies:number
  companyArray: Array<{}> = [
    {name: "All", value: "all"},
    {name: "Regular", value: "regular"},
    {name: "appsumo", value: "appsumo"},
    {name: "JVZOO", value: "JVZOO"},
    {name: "DEALFUEL", value: "DEALFUEL"},
    {name: "WARRIOR", value: "WARRIOR"},
    {name: "APPSUMO_BLACK", value: "APPSUMO_BLACK"},
    {name: "WEBMASTER", value: "WEBMASTER"},
    {name: "AFFILATES", value: "AFFILATES"},
    {name: "PKS", value: "PKS"},
    {name: "BLACK_FRIDAY", value: "BLACK_FRIDAY"},
    {name: "LTD", value: "LTD"}
  ];
  filter = {
    company: [
              {'name':'Name','id':'name'},
              {'name':'Sub Domain','id':'sub_domain'},
              {'name':'Created At','id':'created_at'},
              {'name':'API','id':'api'},
              {'name':'Integration Enabled','id':'integration'},
              {'name':'Admin Created','id':'is_admin_created'},
              {'name':'GDPR','id':'GDPR'},
              {'name':'Current Referral Program','id':'current_referral_program'},
              {'name':'Number of Users','id':'current_limit.users'},
              {'name':'Number of Companies','id':'current_limit.companies'},
              {'name':'Number of Calculaters','id':'current_limit.calculators'},
              {'name':'cname','id':'cname.url'},
              {'name':'Is Appsumo Created','id':'is_appsumo_created'},
              ],
  billings: [
              {'name':'Card Status','id':'billing.customer_card_status'},
              {'name':'Subscription Status','id':'billing.chargebee_subscription_status'},
              {'name':'Chargebee Customer ID','id':'billing.chargebee_customer_id'},
              {'name':'Chargebee Subscription ID','id':'billing.chargebee_subscription_id'},
              {'name':'Current Plan','id':'billing.chargebee_plan_id'},
              ],

    selected_property: '',
    selected_operator: '',
    selected_property_category: '',
    selected_property_type: '',
    selected_value: {},
    visible: true,
  };

  constructor(public companyService: CompanyService,
              public router: Router,
              public _script: Script) {
    super();
  }

  ngAfterViewInit() {
    this._script.load('datatables')
      .then((data) => {
        this.companyType = 'all';
        this.getAllCompany();
      }).catch((error) => {
      console.log('Script not loaded', error);
    });
  }

  getAllCompany() {
    this.loading = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search,
      companyType: this.companyType,
      filter: this.parseFilterData(),

    };
    this.companyService.getAllCompanies(obj)
      .subscribe(
        (response: any) => {
          this.data = response.companies;
          this.loading = false;
          this.totalCompanies=response.count
          this.total_pages = Math.ceil(response.count / this.current_limit);
        }, (error) => {
          console.log(' error in fetching companies', error);
          this.loading = false;
        });
  }


  navigateCompany(id: string) {
    if (id) {
      this.router.navigate(['/admin/company/' + id]);
      window.location.reload();
    }
  }

  paging(num: number) {
    super.paging(num);
    this.getAllCompany();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getAllCompany();
  }

  previous() {
    super.previous();
    this.getAllCompany();
  }

  next() {
    super.next();
    this.getAllCompany();
  }

  searchData() {
    super.searchData();
    this.getAllCompany();
  }

  companyTypeChange(event: any) {
    this.companyType = event.target.value;
    this.getAllCompany();
  }

  showSmartTemplates() {
    if (this.isSmartTemplate) {
      this.data = this.data.filter(app => app.integration === true)
    } else {
      this.getAllCompany();
    }
  }

  addFilter() {
    this.filters.push(Object.assign({}, this.filter)); // passing filter by value
  }
  clearFilters() {
    this.filters.forEach(filter => filter.visible = false);
  }
  removeFilter(index) {
    this.filters[index].visible = false;
  }
  setFilterProperty(target, index) {
    this.filters[index].selected_property_category = target.options[target.options.selectedIndex].className;
    this.filters[index].selected_property_type = 'string';
    this.filters[index].selected_value = ''; // reset selected value
    }

  selected(event, index, type) {
    if (typeof this.filters[index].selected_value === 'string') {
      this.filters[index].selected_value = {};
    }
    if (!Array.isArray(this.filters[index].selected_value[type])) {
      this.filters[index].selected_value[type] = [];
    }
    this.filters[index].selected_value[type].push(event.id);
  }
  select(event,index){
    if(event.hasOwnProperty('start_date')){
    this.filters[index].selected_value=event
    }else{
    this.filters[index].selected_value=event.id
    }
    }
  selectOperator(event,index){
    if(event.id==='-1'){
    this.filters[index].selected_value=event.id
    this.filters[index].selected_operator=event.id
    }
    else{
    this.filters[index].selected_value=''
    this.filters[index].selected_operator=event.id
    }
    }
    
  removed(event, index, type) {
    if (event === 'all') {
      this.filters[index].selected_value[type] = [];
    }
    let i = this.filters[index].selected_value[type].indexOf(event);
    this.filters[index].selected_value[type].splice(i, 1);
  }
  parseFilterData() {
    return this.filters.filter(el => el.visible && el.selected_property &&
      el.selected_property_category && el.selected_property_type && el.selected_value)
      .map(el => {
        let val = {
          property: el.selected_property,
          type: el.selected_property_category,
          value: el.selected_value,
          operator:el.selected_operator
        };

        return val;
      });
  }
  populatePlanTypes() {
    this.companyService.getPlanTypes()
      .subscribe(
        response=>{
          console.log("response",response)
          for(let key in response){
          let obj={}
          obj['id']=response[key]._id ,
          obj['text']=response[key]._id
          this.Plans.push(obj)
        }

      },
        error => console.log(error)
      );
  }



}




