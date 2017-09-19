import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FeatureAuthService} from "../../../../../shared/services/feature-access.service";

declare var jQuery: any;
declare var window:any;
@Component({
  selector: 'company-feature',
  templateUrl: './company-feature.component.html',
  styleUrls: ['./company-feature.component.css'],
})
export class CompanyFeatureComponent implements OnInit {

  id: string;
  features: any;
  edit_mode: Boolean = false;
  loading: Boolean = false;

  constructor(private _featureAuthService: FeatureAuthService, public route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.getCompanyFeatures();
  }

  getCompanyFeatures() {
    this._featureAuthService.getCompanyFeatures(this.id).subscribe((response) => {
        this.features = response;
      },
      (error) => {
        console.log(error);
      })
  }

  subfeatureCheck(index: number) {
    let feature = this.features[index];
    this.features[index].sub_features.forEach((subfeature) => {
      subfeature.active = feature.active;
    });
  }

  parentFeatureCheck(index: number, event) {
    let value = event.target.checked;
    if (value) {
      this.features[index].active = value;
    }
  }

  updateCompanyFeatures() {
    let data = [];
    this.features.forEach(function (feature) {
      let obj = {
        _id: feature._id,
        active: feature.active
      };
      data.push(obj);
      feature.sub_features.forEach(function (sub) {
        let obj2 = {
          _id: sub._id,
          active: sub.active
        };
        data.push(obj2);
      });
    });
    this.loading = true;
    this._featureAuthService.updateCompanyFeatures(data, this.id)
      .subscribe((result) => {
        if (result.update) {
          this.loading = false;
          window.toastNotification("Feature update successfully");
        }
      }, (error) => {
        this.loading = false;
      })
  }

  checkOne(parent, child, event) {
    this.features[parent].sub_features.forEach(function (sub) {
      sub.active = false;
    });
    this.features[parent].sub_features[child].active = event.target.checked;
  }
}
