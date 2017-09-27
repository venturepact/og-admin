import {AfterViewInit, Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompanyService} from "../../../../../shared/services/company.service";
import {AdminService} from "../../../../../shared/services/admin.service";
import {Script} from "../../../../../shared/services/script.service";

declare var jQuery: any;

@Component({
  selector: 'calculators-detail',
  templateUrl: './calculators-detail.component.html',
  styleUrls: ['./calculators-detail.component.css'],
})

export class CalculatorDetailComponent implements AfterViewInit {
  id: string;
  calc_details: Object = [];
  generateKeys = Object.keys;
  event: any = {};

  @Input() company: any;

  constructor(private companyService: CompanyService,
              private adminService: AdminService,
              private route: ActivatedRoute,
              private _script: Script) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngAfterViewInit() {
    this._script.load('datatables')
      .then((data) => {
        this.tableInit();
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });
    this.getEvent();
  }

  getEvent() {
    this.adminService.getWebhookEventsByCompany(this.company.id)
      .subscribe(response => {
        this.event = response;
      })
  }

  tableInit() {
    this.adminService.getCompanyProjects(this.company.sub_domain)
      .subscribe((result) => {
          this.calc_details = result;
          this.getAppsScore();
          setTimeout(function () {
            jQuery('#calc-datatable').DataTable();
          }, 200);
        },
        (error) => {
          console.log("error calc", error);
        });
  }

  link_maker(link: string) {
    let subdomain = this.company.sub_domain;
    let location = window.location.href;
    let domain = location.split('//')[1];
    domain = domain.split('/')[0];
    domain = subdomain + '.' + domain.split('.')[1] + '.' + domain.split('.')[2] + '/' + link;
    return domain;
  }

  calc_navigation(link: string) {
    let url = 'http://' + this.link_maker(link);
    var win = window.open(url, '_blank');
    win.focus();
  }

  getAppsScore() {
    for (let index in this.calc_details) {
      this.adminService.getAppPromotionScore(this.calc_details[index]._id)
        .subscribe(
          response => this.calc_details[index]['score'] = response.score || 0,
          error => console.log(error)
        )
    }
  }
}
