import { Component, OnInit } from '@angular/core';
import { Datatable } from "../../shared/interfaces/datatable.interface";
import { AdminService } from "../../shared/services/admin.service";
declare var moment: any;


@Component({
  selector: 'cache-handling',
  templateUrl: './cache-handling.component.html',
  styleUrls: ['./cache-handling.component.css']
})
export class CacheHandlingComponent extends Datatable implements OnInit {
  keyValues = []
  options: any
  body: any
  header: any

  constructor(private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.adminService.showCacheKey()
      .subscribe(data => {
        this.keyValues = data;
      })
  }

  deleteCache(id: any) {
    console.log("::id::", id)
    let urls = []
    urls.push(id)
    this.adminService.clearCache(urls)
      .subscribe(data => {
        if (data) {
          console.log("Done.!");
        }
        else {
          console.log("nopes")
        }
      })

    this.adminService.showCacheKey()
      .subscribe(data => {
        this.keyValues = data;
      })
  }

  // deleteAllCache() {
  //   let urls = []
  //       urls.push(this.keyValues)
  //       console.log("::URLS::",urls)

  //     this.adminService.clearCache(urls)
  //     .subscribe(data => {
  //       if (data) {
  //         console.log("Done.!");
  //       }
  //       else {
  //         console.log("nopes")
  //       }

  //     })
    
  // }
}
