import { MatPaginator, MatTableDataSource } from "@angular/material";
import {
  Component,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  SimpleChanges
} from "@angular/core";
import { AdminService } from "../../../../shared/services/admin.service";
import { Router } from "@angular/router";
import { CookieService, Script } from "../../../../shared/services";
import { Observable } from "rxjs/Observable";

declare var jQuery: any;
declare var window: any;

@Component({
  selector: "og-error-log",
  templateUrl: "./error-log.component.html",
  styleUrls: ["./../../log.component.css"],
})
export class ErrorLogComponent {
  displayedColumns = ["id", "err_trace", "name", "message", "time"];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // EventEmitter for Modal
  @Output() openModel: EventEmitter<any> = new EventEmitter();
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter();
  @Input()
  filter = true;
  logsPresent = true;

  // Date Data
  @Input() // experimental
  dateData: any;
  @Input()
  searchQuery: any;
  @Input()
  APISource: any;

  // Lookout
  scriptLoaded = false;
  apiSelect: string;
  apiSwitched: boolean;
  logs: Array<String>;
  message: String;
  folderName: String;
  firsTime = true;
  isLoading = false;

  // From API
  paginatorON = true;
  pageEvent: any;

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
    this._adminService.getlogType().subscribe(data => {
      this.folderName = data || "errorLogs";
    });
    this.onRefresh();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.apiSwitched = false;
    if(changes.APISource && !changes.APISource.isFirstChange()){
      this.onRefresh()
      this.apiSwitched = true;
    }
    if (changes.dateData && !changes.dateData.isFirstChange()) {
      this.onRefresh();
    }
    if (changes.searchQuery && !changes.searchQuery.isFirstChange()) {
      this.applyFilter();
    }
  }

  // @desc Request to the route to get data of error logs
  requestForLog() {
    let obj = {
      limit: (this.paginator ? this.paginator.pageSize : 10) || 10,
      page: (this.paginator ? this.paginator.pageIndex : 10) || 0,
      selectedDate: this.dateData,
      folder: this.folderName,
      searchKey: this.searchQuery || "",
      isFirstTime: this.firsTime
    };
    this.isLoading = true;
    this.message = "loading...";
    this._adminService.getLog(obj).subscribe(
      response => {
        this.logs = response.logs;
        this.logsPresent = true;
        this.filterChange.emit(true);
        this.dataSource = new MatTableDataSource(this.logs);
        this.paginator.length = response.count;
        this.apiSwitched = false;
        this.isLoading = false;
        this.message = "";
      },
      error => {
        this.errorHandler();
        this.dataSource = new MatTableDataSource([]);
      }
    );
  }

  // @desc: New Request for upcoming/next data
  pageEventCall() {
    this.firsTime = false;
    this.requestForLog();
  }

  // @desc: For Date Clearifiction in Angular Pipe
  createDate(body) {
    if (!body || body === undefined) return false;
    let date = body.trim().split(/[\s-\/:]+/);
    return new Date(date[2], date[1] - 1, date[0], ...date.splice(-3));
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

  // @desc: Send Data to Modal Component
  parseBody(body, logType) {
    this.openModel.emit(body);
  }

  applyFilter() {
    // if (
    //   this.searchQuery ||
    //   this.searchQuery.length > 2 ||
    //   this.searchQuery.length === 0
    // ) {
    this.searchQuery.trim();
    this.paginator.pageIndex = 0;
    this.firsTime = false;
    this.requestForLog();
    // }
  }

  // @desc: On Making Comppletely New Request
  onRefresh() {
    this.firsTime = true;
    this.paginator.pageIndex = 0;
    this.paginator.length = 0;
    this.searchQuery = "";
    this.requestForLog();
  }

  // @Desc: Error Handler 
  errorHandler() {
    if (this.apiSwitched) {
      window.toastNotification("API Not Responding!...");
    } else {
      window.toastNotification("No log found!...");
    }
    this.isLoading = false;
    this.firsTime = true;
    this.paginator.length = 0;
    this.paginator.pageSizeOptions = [];
    this.paginatorON = false;
    this.logsPresent = false;
    this.filterChange.emit(false);
    this.logs = [];
  }
}
