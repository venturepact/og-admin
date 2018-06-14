import { Component, AfterViewInit } from '@angular/core';
import { Datatable } from '../../shared/interfaces/datatable.interface';
import { UserService } from "../../shared/services/user.service";
import { Script } from "../../shared/services/script.service";
import { Router } from "@angular/router";
import { CookieService } from "../../shared/services/cookie.service";

declare var jQuery: any;

@Component({
    selector: 'og-email-logs',
    templateUrl: './email-logs.component.html',
    styleUrls: ['./email-logs.component.css', './../ionicons.min.css'],
})

export class EmailLogsComponent extends Datatable implements AfterViewInit {
    data: Object = [];
    selected: any;
    loading: boolean = false;
    logType: string = 'email';
    constructor(public _userService: UserService, public _script: Script, public _cookieService: CookieService, public router: Router) {
        super();
        if (this._cookieService.readCookie('storage')) {
            let storage = JSON.parse(this._cookieService.readCookie('storage'));
            if (storage.user.sub_role !== null)
                this.router.navigate(['/admin/users']);
        }
    }


    ngAfterViewInit() {
        this._script.load('datatables')
            .then((data) => {
                this.getEmails();
            })
            .catch((error) => {
                console.log('Script not loaded', error);
            });
    }

    getEmails() {
        this.loading = true;
        let obj = {
            limit: this.current_limit,
            page: this.current_page - 1,
            searchKey: this.search
        };
        this._userService.getEmailLogs(obj)
            .subscribe(
            (response: any) => {
                this.data = response.emails;
                this.total_pages = Math.ceil(response.count / this.current_limit);
                this.loading = false;
            },
            (response: any) => {
                console.log('Email error', response);
                this.loading = false;
            }
            );
    }

    getDealLogs(){
        this.loading = true;
        let obj = {
            limit: this.current_limit,
            page: this.current_page - 1,
            searchKey: this.search
        };
        this._userService.getDealLogs(obj)
            .subscribe(
            (response: any) => {
                this.data = response.dealLogs;
                this.total_pages = Math.ceil(response.count / this.current_limit);
                this.loading = false;
            },
            (response: any) => {
                console.log('Email error', response);
                this.loading = false;
            }
            );
    }

    paging(num: number) {
        super.paging(num);
        this.selectLog();
    }

    limitChange(event: any) {
        super.limitChange(event);
        this.selectLog();
    }

    previous() {
        super.previous();
        this.selectLog();
    }
    next() {
        super.next();
        this.selectLog();
    }

    searchData() {
        super.searchData();
        this.selectLog();
    }
    parseBody(body) {
        this.selected = this.logType == 'email' ? JSON.parse(body) :  body;
    }
    generateKeys(obj) {
        return Object.keys(obj);
    }

    selectLog(){
        switch(this.logType){
            case 'email': this.getEmails();
                            break;
            case 'deal': this.getDealLogs();
                        break;
            default: break;
        }
    }

    logTypeChange(event: any) {
        this.logType = event.target.value;
        this.selectLog();
    }
}

