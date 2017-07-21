import { Datatable } from '../../shared/interfaces/datatable.interface';
import {Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import {FormGroup, FormBuilder ,Validators } from '@angular/forms';
import { AdminService} from './../../shared/services/admin.service';
import {Script} from '../../shared/services/script.service';
declare var jQuery: any;
declare var window: any;

@Component({
	selector: 'promotion-checklist',
	templateUrl: './promotion-checklist.component.html',
  	styleUrls: ['./promotion-checklist.component.css'],
   	encapsulation: ViewEncapsulation.None
})

export class PromotionChecklist extends Datatable implements OnInit {

	loading: boolean = true;

	promoGoals : any = [];

	promoListItems : any = [];

	modalData : any = {
		'id': '',
		'strategy': '',
		'category': '',
		'goals': [],
		'score': 1,
		'resource': '',
		'description': ''
	};
	
	constructor(
		public _adminService: AdminService,
  		public fb: FormBuilder,
		public _script: Script
	) {
		super();
	}

	ngOnInit(){
		this.getPromotionGoals();
	}

	ngAfterViewInit() {
		this._script.load('datatables')
			.then(data => this.getPromoCheckList())
			.catch(err => console.log(err))
	}

	getPromotionGoals() {
		let self = this;

		let promoSettings = self._adminService.getSiteSettings()
			.subscribe(
				(success: any) => self.promoGoals = success.promotionCheckList.goals,
				(error: any) => console.log(error)
			)
	}

	getPromoCheckList () {
		let self = this;
		self.loading = true;
		let dataTableAttr = {
	      limit: this.current_limit,
	      page: this.current_page - 1,
	      searchKey: this.search
	    };

		let promoList = self._adminService.getPromoCheckListItems(dataTableAttr)
			.subscribe(
				(success:any) => {
					self.total_pages = Math.ceil(success.count / self.current_limit);
					self.promoListItems = success.items
					self.loading = false;
				},
				(error:any) => { 
					console.log(error)
					self.loading = false; 
				}
			)
	}

	deletePromoItem (id, index) {
		let self = this;
		self.loading = true;
		let result = self._adminService.deletePromoCheckListItems(id)
			.subscribe(
				(success: any) => {
					self.total_pages = Math.ceil(success.count / self.current_limit);
					self.promoListItems.splice(index, 1)
					self.loading = false;
				},
				(error:any) => {
					console.log(error)
					self.loading = false;
				}
			)
	}

	resetOpenPopup(reset = false, open=true, id = null, index = null) {
		
		if (open) jQuery('#myModal').modal();
		
		var self = this;

		self.modalData.id = id ? id : '';
		self.modalData.strategy = reset ? '' : self.promoListItems[index].strategy;
		self.modalData.category = reset ? '' : self.promoListItems[index].category;
		self.modalData.score = reset ? 1 : self.promoListItems[index].score;
		self.modalData.resource = reset ? '' : self.promoListItems[index].resource;
		self.modalData.description = reset ? '' : self.promoListItems[index].description;
		self.modalData.goals = reset ? [] : self.promoListItems[index].goals;
	}

	saveUpdateListItem () {
		var self = this;
		self.loading = true;
		let data = Object.assign({}, self.modalData);
		
		delete data.id;
	
		for (var key in data) {
			if (!key.match('resource') && !key.match('description')) {
				if (('goals' === key && data[key].length === 0) || data[key] === ''){
					alert('Please fill in form completely');
					self.loading = false;
					return;
				}
			}
		}

		jQuery('#myModal').modal('toggle');

		if (!self.modalData.id) {
			self._adminService.savePromoCheckListItems(data)
				.subscribe(
					(success) => {
						self.total_pages = Math.ceil(success.count / self.current_limit);
						self.promoListItems.unshift(success.item)
						self.loading = false;
					},
					(error) => {
						self.loading = false;
						console.log(error)
					}
				)
			return;
		}
		self._adminService.updatePromoCheckListItems(self.modalData.id, data)
			.subscribe(
				(success) => {
					for (let key in self.promoListItems)
						if (self.promoListItems[key]._id == self.modalData.id) {
							self.promoListItems.splice(key, 1);
							break;
						}
					self.total_pages = Math.ceil(success.count / self.current_limit);
					self.promoListItems.unshift(success.item)
					self.loading = false;
				},
				(error) => {
					self.loading = false;
					console.log(error)
				}
			)
	}

	paging(num: number) {
		super.paging(num);
		this.getPromoCheckList();
	}

	limitChange(event: any) {
		super.limitChange(event);
		this.getPromoCheckList();
	}

	previous() {
		super.previous();
		this.getPromoCheckList();
	}

	next() {
		super.next();
		this.getPromoCheckList();
	}

	searchData() {
		super.searchData();
		this.getPromoCheckList();
	}
}