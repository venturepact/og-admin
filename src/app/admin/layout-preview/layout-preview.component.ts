import { Component, OnInit } from '@angular/core';
import { LayoutService } from './../../shared/services/layoutPreview.service';
declare var window: any;

@Component({
  selector: 'app-layout-preview',
  templateUrl: './layout-preview.component.html',
  styleUrls: ['./layout-preview.component.css']
})
export class LayoutPreviewComponent implements OnInit {
  public loading: boolean = true;
  public templateTypes: any = [];
  public layoutDetails: any = null;
  public selectLayout: String = '';
  constructor(private _layoutService: LayoutService) { }

  ngOnInit() {
    this._layoutService.getTemplateLayoutData().subscribe(data => {
      this.templateTypes = [];
      for (let key in data) {
        this.templateTypes.push(key);
      }
      this.loading = false;
      this.layoutDetails = data;
      this.selectLayout = '';
    }, err => {
      console.log('Layout get error');
    });
  }

  slectedType(templateType: any) {
    this.selectLayout = templateType;
  }

  saveUrl(index: number) {
    let val;
    eval("val=this.layoutDetails[this.selectLayout]");
    this._layoutService.savePreviewUrl({ url: val[index].url }, val[index]._id)
      .subscribe(data => {
        window.toastNotification('Url updated successfully');
      }, err => window.toastNotification('Some error occured! Try again'));
  }

}
