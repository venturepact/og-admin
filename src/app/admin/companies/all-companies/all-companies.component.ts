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
  data: Object = [];
  loading: boolean = false;
  companyType: string = 'all';
  companyArray: Array<{}> = [
    {name: "All", value: "all"},
    {name: "Regular", value: "regular"},
    {name: "appsumo", value: "appsumo"},
    {name: "JVZOO", value: "JVZOO"}
  ];

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
      companyType: this.companyType
    };
    this.companyService.getAllCompanies(obj)
      .subscribe(
        (response: any) => {
          this.data = response.companies;
          this.loading = false;
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

}




