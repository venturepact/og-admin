import { Component, OnInit } from '@angular/core';
import { Datatable } from '../../shared/interfaces/datatable.interface';
import { AdminService } from '../../shared/services/admin.service';

declare var window: any;
@Component({
  selector: 'app-app-search',
  templateUrl: './app-search.component.html',
  styleUrls: ['./app-search.component.css']
})
export class AppSearchComponent extends Datatable implements OnInit {
  loading: boolean = false;
  images: Array<Object>;
  imagesLength: number;
  constructor(public _adminService: AdminService) {
    super();
  }

  ngOnInit() {
  }
  getImages() {
    this.loading = true;
    let obj = {
      searchKey : this.search
    }
    this._adminService.getImages(obj).subscribe((response: any) => {
      this.loading = false;
      this.images = response.result ? response.result : []
      this.imagesLength = this.images ? this.images.length : 0
    }, (error) => {
      this.loading = false;
      window.toastNotification("Failed to fetch Images")
    })
  }

 
}



