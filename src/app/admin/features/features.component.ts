import { ActivatedRoute } from '@angular/router';
import { Datatable } from './../../shared/interfaces/datatable.interface';
import { Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren } from '@angular/core';
import { FeaturesService } from './services/features.service';
import { FormGroup } from '@angular/forms';
import { PlanService } from '../../shared/services/plan.service';
import { SelectComponent, SelectItem } from 'ng2-select';
import { Script } from '../../shared/services/index';
import { environment } from '../../../environments/environment';
environment
declare var jQuery: any;
declare var bootbox: any;
declare var window: any;

@Component({
  selector: 'features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
})
export class FeatureComponent extends Datatable implements OnInit {
  selectedItem: String = 'features';
  @ViewChildren('selections') public ngSelect: SelectComponent[];
  featureForm: FormGroup;
  edit: boolean;
  loading: Boolean = false;
  errorMessage = '';
  plans = [];
  selectedPlans = [];
  plan_features = [];
  parent_features = [];
  disableSelection: Boolean = false;
  oldFeature: any = {};
  syncApi = '';
  constructor(public _featureService: FeaturesService,
    public _planService: PlanService, public route: ActivatedRoute,
    public _script: Script) {
    super();
  }
  features: any = [];
  ngOnInit() {

    let hostName = window.location.hostname;
    if (hostName.includes('rely.co')) {
      this.syncApi = environment.STAGING_API;
    } else if (hostName.includes('outgrow.co.in')) {
      this.syncApi = environment.STAGING_API;
    } else if (hostName.includes('outgrow.local')) {
      this.syncApi = environment.STAGING_API;
    } else if (hostName.includes('outgrow.in')) {
      this.syncApi = environment.STAGING_API;
    }
    this.route.params.subscribe(params => {
      this.selectedItem = params['type'];
      if (this.selectedItem == 'features') {
        this.featureForm = this._featureService.getForm();
        this._planService.getPlanTypes().subscribe((data) => {
          console.log(data);
          Object.keys(data).forEach((key: any) => {
            this.plans.push(...(data[key].map(obj => {
              obj['id'] = obj['_id'];
              obj['text'] = obj['name'];
              delete obj['_id'];
              delete obj['name'];
              delete obj['plan_type'];
              return obj;
            })));
          });
          console.log(this.plans);
        })
        this.getFeatures();
      }
    });

  }
  getFeatures() {
    this.loading = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search
    };
    let $ref = this._featureService.getFeatures(obj)
      .subscribe(response => {
        this.loading = false;
        this.features = response['features'] || [];
        this.parent_features = response['parent_features'] || [];
        this.plan_features = response['plan_features'] || [];
        this.total_pages = Math.ceil(response.count / this.current_limit);
        $ref.unsubscribe();
      }, error => {
        $ref.unsubscribe();
      })
  }
  fileChange(event) {
    this._featureService.fileReader(event).subscribe(csv => {
      //console.log(csv);
      let features = this.csvToFeatures(csv);
      console.log(features);
      this.addFeatures(features);
    }, error => {
      console.log(error);
    })
  }
  csvToFeatures(csv) {
    let lines = csv.split('\n');
    let keys = lines[0].split(',').map(key => key.trim());
    lines.splice(0, 1);
    lines = lines.reduce((acc, line, index) => {
      let values = line.split(',').map(val => val.trim());
      let validLine = values.some(value => value);
      let invalid = false;
      let validationKeys = ['_id'];
      if (validLine) {
        let obj = keys.reduce((acc, key, index) => {
          if (invalid) return;
          acc[key] = values[index];
          if (key == 'plans') {
            acc[key] = values[index] ? values[index].split(' ') : [];
          }
          if (key == 'parent_feature' && values[index] == 'null') {
            acc[key] = null;
          }
          if (validationKeys.includes(key) && !values[index]) {
            acc = {};
            invalid = true;
          }
          return acc;
        }, {});
        obj && obj['_id'] && acc.push(obj);
      }
      return acc;
    }, []);
    return lines;
  }
  editFeature(index) {
    this._featureService.setForm(this.features[index]);
    this.oldFeature = JSON.parse(JSON.stringify(this.features[index]));
    this.edit = true;
  }
  addfeature(obj) {
    obj['parent_feature'] = obj['parent_feature'] || null;
    obj['plans'] = this.selectedPlans;
    this.disableSelection = true;
    this.addFeatures([obj]);
  }
  addFeatures(arr) {
    if (Object.prototype.toString.call(arr) == '[object Array]' && arr.length > 0) {
      this._featureService.addFeatures(arr).subscribe((data) => {
        console.log(data);
        if (data && data['invalidFeatures'].length) {
          this.errorMessage = `Feature already exist or parent feature doesn't exists`;
          return;
        }
        this.featureAdded();
        this.getFeatures();
      }, error => {
        this.disableSelection = false;
        this.errorMessage = error.error.err_message;
      })
    }
  }
  removeFeature(feature) {
    bootbox.dialog({
      size: 'small',
      message: `<div class="bootbox-body-left">
                  <div class="mat-icon">
                  <i class="material-icons">error</i>
                  </div>
                </div>
                <div class="bootbox-body-right">
                  <p class="one-line-para">Are you sure you want to delete this feature?</p>
                </div>`,
      buttons: {
        cancel: {
          label: "Cancel",
          className: "btn-cancel btn-cancel-hover",
        },
        success: {
          label: "OK",
          className: "btn btn-ok btn-hover",
          callback: () => {
            this._featureService.removeFeature(feature).subscribe(data => {
              console.log(data);
              window.toastNotification('Feature deleted Succesfully...');
              this.getFeatures();
            }, error => {
              window.toastNotification('Failed to delete feature...');
            })
          }
        }
      }
    });

  }
  updatefeature(obj) {
    console.log(obj);
    // return;
    let keys = Object.keys(obj).reduce((acc, key) => {
      if (this.oldFeature[key] != obj[key]) {
        acc.push(key);
      }
      return acc
    }, []);
    if (keys.length) {
      obj['parent_feature'] = obj['parent_feature'] || null;
      this._featureService.updateFeature({ feature: obj, oldFeature: this.oldFeature, keys })
        .subscribe((data) => {
          console.log(data);
          this.featureAdded();
          this.getFeatures();
        }, error => {
          this.errorMessage = error.error.err_message;
        });
    } else {
      console.log('no-changes');
    }
  }
  featureAdded() {
    jQuery("#add-feature").modal('hide');
    this.resetPlans();
    this.errorMessage = '';
  }
  paging(num: number) {
    super.paging(num);
    this.getFeatures();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getFeatures();
  }

  previous() {
    super.previous();
    this.getFeatures();
  }

  next() {
    super.next();
    this.getFeatures();
  }

  searchData() {
    super.searchData();
    this.getFeatures();
  }
  currentSelections(event) {
    console.log(event);
    this.selectedPlans = event.map(obj => {
      return obj['id'];
    });
  }
  resetPlans() {
    if (this.ngSelect) {
      this.ngSelect.forEach(s => (s.active = []));
      this.selectedPlans = [];
    }
    this.disableSelection = false;
    this.errorMessage = '';
  }
  mediaType(e) {
    this.featureForm.get('media_type').setValue(e.id);
  }
  getPlansByFeature(feature) {
    return this.plan_features.reduce((acc, pf) => {
      if (pf['features'] && pf['features'].includes(feature)) {
        acc.push(pf['plan']);
      }
      return acc;
    }, []);
  }
  async syncFeature(feat, icon, api = this.syncApi) {
    const apis = this.getApis();
    const box = bootbox.prompt({
      title: `Are you sure you want to sync ${feat._id}?`,
      inputType: 'select',
      className: "dialogWide",
      inputOptions: apis,
      callback: async (api) => {
        if (!api) {
          window.toastNotification(`Please select Api`);
          return;
        }
        try {
          jQuery(`#${icon}`).addClass('fa-spin');
          console.log(feat);
          delete feat['createdAt'];
          delete feat['sub_features'];
          delete feat['__v'];
          delete feat['seq'];
          delete feat['updatedAt'];

          feat['plans'] = this.getPlansByFeature(feat['_id']);
          console.log(feat);

          let data = await this.syncFeatures([feat], api);
          if (data && data['invalidFeatures'].length) {
            window.toastNotification(`Feature already exist or parent feature doesn't exists`);
            jQuery(`#${icon}`).removeClass('fa-spin');
            return;
          }
          window.toastNotification(`Feature added..`);
          jQuery(`#${icon}`).removeClass('fa-spin');
        } catch (e) {
          console.log(e);
          window.toastNotification(e.error ? e.error.err_message : 'Something went wrong..');
          jQuery(`#${icon}`).removeClass('fa-spin');
        }

      }
    });
    box.find('form').css({ 'width': '100%' });


  }
  async syncFeatures(arr, api = this.syncApi) {


    try {
      if (Object.prototype.toString.call(arr) == '[object Array]' && arr.length > 0) {
        return this._featureService.syncFeatures(arr, api).toPromise();
      }
      return Promise.reject({ error: { err_message: 'No feature to add..' } });
    } catch (e) {
      throw e;
    }
  }
  getApis(){
    const apis = [];
    const hostName = window.location.hostname;
    if (hostName.includes('rely.co')) {
      apis.unshift({
        text: 'Live',
        value: 'https://api.outgrow.co/api/v1',
      });
    } else if (hostName.includes('outgrow.co.in') || hostName.includes('outgrow.in')) {
      apis.unshift({
        text: 'Rely',
        value: this.syncApi,
      });
      hostName.includes('outgrow.co.in') && apis.push({
        text: 'cricket(.in)',
        value: 'https://og-safacademy.herokuapp.com/api/v1',
      });
      hostName.includes('outgrow.co.in') || apis.push({
        text: 'Biz (.co.in)',
        value: 'https://outgrow-biz-api.herokuapp.com/api/v1',
      });
    } else if (hostName.includes('outgrow.local')) {
      apis.push(...[{
        text: 'cricket(.in)',
        value: 'https://og-safacademy.herokuapp.com/api/v1',
      },
      {
        text: 'Biz (.co.in)',
        value: 'https://outgrow-biz-api.herokuapp.com/api/v1',
      }]);
    }
    return apis;
  }
}
