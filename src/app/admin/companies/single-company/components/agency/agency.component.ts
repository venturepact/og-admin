import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from '../../../../../shared/services/company.service';

@Component({
  selector: 'agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {
  loading = false;
  edit_mode = false;
  errorMessage = '';
  @Input() company: any;
  constructor(private _fb: FormBuilder, public companyService: CompanyService) { }
  agencyForm: FormGroup;
  ngOnInit() {
    this.agencyForm = this._fb.group({
      agency: [false],
      companies: [0],
      logo: [false]
    });
    this.getAgencyData(this.company);
  }
  getAgencyData(company) {
    this.loading = true;
    const $agencyData = this.companyService.getAgencyData(company)
      .subscribe((data) => {
        this.loading = false;

        this.agencyForm.patchValue(data);
        $agencyData.unsubscribe();
      }, err => {
        this.loading = false;

        $agencyData.unsubscribe();
        console.log(err);
      })
  }
  updateAgencyData(company, data) {
    this.loading = true;
    const $agencyData = this.companyService.updateAgencyData(company, data)
      .subscribe((data) => {
        this.loading = false;

        // this.agencyForm.patchValue(data);
        $agencyData.unsubscribe();
      }, err => {
        this.loading = false;

        $agencyData.unsubscribe();
        console.log(err);
      })
  }
}
