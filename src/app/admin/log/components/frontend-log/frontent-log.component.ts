import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  SimpleChanges
} from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Script, CookieService } from "../../../../shared/services";
import { Router } from "@angular/router";
import { AdminService } from "../../../../shared/services/admin.service";
import { Observable } from "rxjs/Observable";
declare var jQuery: any;
declare var window: any;

@Component({
  selector: "og-frontend-log",
  templateUrl: "./frontend-log.component.html",
  styleUrls: ["./../../log.component.css"]
})
export class FrontentLogComponent {
  displayedColumns = ["id", "subdomain", "error", "time"];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // EventEmitter for Modal
  @Output() openModel: EventEmitter<any> = new EventEmitter();
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter();
  @Input()
  filter = true;

  // Date Data
  @Input()
  dateData: any;
  @Input()
  searchQuery: any;
  @Input()
  APISource: any;
  @Input()
  logsPresent = true;

  scriptLoaded: boolean;
  logs: any;
  isLoading = false;
  apiSwitched = false;


  constructor(
    public _adminService: AdminService,
    public _cookieService: CookieService,
    public router: Router,
    public _script: Script
  ) {
    if (this._cookieService.readCookie("storage")) {
      let storage = JSON.parse(this._cookieService.readCookie("storage"));
      if (storage.user.sub_role !== null)
        this.router.navigate(["/admin/users"]);
    }
  }

  ngOnInit() {
    this.loadScripts();
    this.requestForFrontendLogs();
    // this.filterOptions.subscribe(value => {
    //   if (value.doRefresh) {
    //     this._dateData = value.dateData;
    //     this._APISource = value.APISource;
    //     console.log('apply filtre2: ', value)
    //   } else {
    //     console.log('apply filtre: ', value)
    //     this._searchQuery = value.searchQuery;
    //     this.applyFilter();
    //   }
    //   this.cd.markForCheck();
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.apiSwitched = false;
    if (changes.APISource && !changes.APISource.isFirstChange()) {
      this.requestForFrontendLogs();
      this.apiSwitched = true;
    }
    if (changes.dateData && !changes.dateData.isFirstChange()) {
      this.requestForFrontendLogs();
    }
    if(changes.searchQuery && !changes.searchQuery.isFirstChange()) {
      this.applyFilter();
    }
  }

  // @desc: Load All the Scripts Required For Page Distribution
  loadScripts() {
    this._script
      .load("datatables", "daterangepicker")
      .then(data => {
        this.scriptLoaded = true;
        // this.requestForLog();
      })
      .catch(error => {
        console.log("Script not loaded", error);
      });

    jQuery(".modal").on("hidden.bs.modal", function() {
      this.error = false;
      this.errorMessage = "";
    });
    jQuery(".daterangepicker").click(() => {
      alert("select date");
    });
  }

  // @desc Request to the route to get data of error logs
  requestForFrontendLogs() {
    let logQuery = {
      limit: (this.paginator ? this.paginator.pageSize : 10) || 10,
      page: (this.paginator ? this.paginator.pageIndex : 10) || 0,
      searchKey: this.searchQuery || "",
      createdAt: new Date(this.dateData)
    };
    this.isLoading = true;
    this._adminService.getFrontendLog(logQuery).subscribe(
      response => {
      this.logs = response.logs;
      this.isLoading = false;
      this.logsPresent = true;
      this.filterChange.emit(true);
      this.dataSource = new MatTableDataSource(this.logs);
      this.paginator.length = response.count;
    },
    error => {
      this.errorHandler();
      this.dataSource = new MatTableDataSource([]);
    }
  );
  }

  // @desc: For Date Clearifiction in Angular Pipe
  createDate(body) {
    if (!body || body === undefined) return false;
    let date = body.trim().split(/[\s-\/:]+/);
    return new Date(date[2], date[1] - 1, date[0], ...date.splice(-3));
  }

  // @desc: Send Data to Modal Component
  parseBody(body, logType) {
    this.openModel.emit(body);
  }

  // @desc: New Request for upcoming/next data
  pageEventCall() {
    this.requestForFrontendLogs();
  }

  applyFilter() {
    this.searchQuery.trim();
    this.paginator.pageIndex = 0;
    this.requestForFrontendLogs();
  }

  // @Desc: Error Handler 
  errorHandler() {
    if (this.apiSwitched) {
      window.toastNotification("API Not Responding!...");
    } else {
      window.toastNotification("No log found!...");
    }
    this.isLoading = false;
    this.paginator.length = 0;
    this.paginator.pageSizeOptions = [];
    this.logsPresent = false;
    this.filterChange.emit(false);
    this.logs = [];
  }
}
