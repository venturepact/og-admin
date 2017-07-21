import { Component, AfterViewInit, Input } from '@angular/core';
import {CompanyService} from './../../../../../shared/services/company.service';
import {AdminService} from './../../../../../shared/services/admin.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Script} from './../../../../../shared/services/script.service';
declare var jQuery: any;

@Component({
	selector: 'calculators-detail',
	templateUrl: './calculators-detail.component.html',
	styleUrls: ['./calculators-detail.component.css'],
})

export class CalculatorDetailComponent implements AfterViewInit {
	id: string;
	calc_details: Object = [];
	@Input() company: any;
	constructor(public companyService: CompanyService, public adminService: AdminService,
		public route: ActivatedRoute,
		public _script: Script ,
		public router : Router) {
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
	}

	tableInit() {
		this.adminService.getCompanyProjects(this.company.sub_domain)
			.subscribe((result) => {
				this.calc_details = result;
				console.log(this.calc_details, 'this is the details');
				this.getAppsScore();
				setTimeout(function() {
					jQuery('#calc-datatable').DataTable();
				}, 200);
			},
			(error)=>{
				console.log("error calc", error);
			});
	}

	link_maker(link : string){
		let subdomain = this.company.sub_domain;
		let location = window.location.href;
		let domain = location.split('//')[1];
		domain = domain.split('/')[0];
		domain = subdomain + '.' + domain.split('.')[1] + '.' + domain.split('.')[2] + '/' + link ;
		return domain;
	}

	calc_navigation(link : string){
		let url = 'http://' + this.link_maker(link);
		var win = window.open(url, '_blank');
  		win.focus();
	}

	getAppsScore () {
		for (let index in this.calc_details) {
			this.adminService.getAppPromotionScore(this.calc_details[index]._id)
				.subscribe(
					response => this.calc_details[index]['score'] = response.score || 0,
					error => console.log(error)
				)
		}
	}
}
