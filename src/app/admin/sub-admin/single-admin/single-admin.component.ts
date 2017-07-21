import {OnInit, Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CompanyService} from './../../../shared/services/company.service';
import {UserService} from '../../../shared/services/user.service';


@Component({
  selector: 'app-singleadmin',
  templateUrl: './single-admin.component.html',
  styleUrls: ['./single-admin.component.css','../../ionicons.min.css','./../../../../assets/css/sahil-hover.css', './../../../../assets/css/custom-material.css']
})
export class SingleadminComponent implements OnInit {
id: any;
  name : string;
  companies : any[];
  loading :boolean = false;
  constructor(
    public route: ActivatedRoute,
    public userService: UserService,
    public _companyService: CompanyService
    ) {
       this.route.params.subscribe(params => {
       this.id = params['id'];
      });

  }

  ngOnInit() {
    this.loading = true;
    this._companyService.getUserCompanies(this.id).subscribe((result)=>{
      this.companies = result;
      this.loading = false;
    });
}
}
