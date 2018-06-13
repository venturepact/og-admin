import { Component, OnInit } from '@angular/core';
import { Datatable } from "../../shared/interfaces/datatable.interface";
import { AdminService } from "../../shared/services/admin.service";
import { JSONCompareForCache } from '../../shared/services/helper-service/json-compare';
declare var moment: any;
declare var window: any;
declare var bootbox: any;
@Component({
  selector: 'cache-handling',
  templateUrl: './cache-handling.component.html',
  styleUrls: ['./cache-handling.component.css']
})
export class CacheHandlingComponent extends Datatable implements OnInit {
  popupKeyName: any;
  valueOfKey: any;
  values: any;
  keys: any;
  keyValues = []
  main = []
  options: any
  body: any
  header: any
  searchText: any

  constructor(private adminService: AdminService, private _JSONCompareForCache: JSONCompareForCache) {
    super();
  }

  ngOnInit() {
    this.getCacheLogs()
  }
  getCacheLogs() {
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1
    };
    this.adminService.showCacheKey(obj)
      .subscribe(success => {
        for (let i = 0; i < success.data.length; i++)
          success.data[i] = JSON.parse(success.data[i])
        this.keyValues = success.data;
        console.log(this.keyValues)
        this.main = this.keyValues;
        this.total_pages = Math.ceil(success.count / this.current_limit);
      }, (error: any) => {
        window.toastNotification("Failed to load cache...")
      })
  }
  limitChange(event: any) {
    console.log(event)
    super.limitChange(event);
    this.getCacheLogs();
  }
  paging(num: number) {
    super.paging(num);
    this.getCacheLogs();
  }
  previous() {
    super.previous();
    this.getCacheLogs();
  }
  next() {
    super.next();
    this.getCacheLogs();
  }
  
  searchData() {
    if (this.searchText !== '' || this.searchText !== undefined) {
      this.searchText = this.searchText.trim();
      this.keyValues = this.main.filter((ele) => {
        return ((ele.key.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1))
      });
    }
  }
  KeyValueDispaly(id, keyName) {
    let self = this;
    console.log("::",id,keyName)
    self.popupKeyName = keyName
    console.log("id is:",id,"keyName:",keyName,"value is :",self.keyValues[id].value)
    document.getElementById("json").innerHTML = JSON.stringify(self.keyValues[id].value,null,1)
    // self._JSONCompareForCache.compareJson(self.valueOfKey);
    // self.valueOfKey = Object.keys(self.valueOfKey).reduce((acc, key) => {
    //   return acc + self.valueOfKey[key];
    // }, '')
  }
  deleteCache(index, keyName) {
    let self = this;
    let keys = []
    keys.push(keyName)
    bootbox.dialog({
      size: 'small',
      message: `<div class="bootbox-body-left">
    <div class="mat-icon">
    <i class="material-icons">error</i>
    </div>
    </div>
    <div class="bootbox-body-right">
    <p class="one-line-para">Are you sure you want to delete this cache?</p>
    </div>
    `,
      buttons: {
        cancel: {
          label: "Cancel",
          className: "btn-cancel btn-cancel-hover",
        },
        success: {
          label: "OK",
          className: "btn btn-ok btn-hover",
          callback: function () {
            self.adminService.clearCache(keys)
              .subscribe(data => {
                if (data) {
                  window.toastNotification('Cache deleted Succesfully...');
                  self.keyValues.splice(index, 1)
                }
                else {
                  window.toastNotification('Failed to delete Cache...');
                }
              }, error => {
                window.toastNotification('Failed to delete Cache...');
              })
          }
        }
      }
    });
  }

}
