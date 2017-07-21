import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from './../../../../../shared/services/admin.service';
import { Script } from './../../../../../shared/services/script.service';

declare var jQuery: any;

@Component({
    selector: 'og-user-logs',
    templateUrl: './user-logs.component.html',
    styleUrls: ['./user-logs.component.css']
})
export class UserLogComponent implements OnInit, AfterViewInit {

    id: number;
    inbox: any = null;
    outbox: any = null;
    constructor(public _adminService: AdminService, public route: ActivatedRoute, public _script: Script) {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }


    ngOnInit() {
        //console.log('User Logs invoked');
    }

    ngAfterViewInit() {
        this._script.load('datatables')
            .then((data) => {
                this.get_emails_inbox();
                this.get_emails_outbox();
            })
            .catch((error) => {
                console.log('Script not loaded', error);
            });
    }


    get_emails_inbox() {
        if (this.inbox == null) {
            this._adminService.getEmailLogs(this.id, 'inbox')
                .subscribe((result) => {
                    this.inbox = result;
                    setTimeout(function () {
                        jQuery('#inbox-datatable').DataTable();
                    }, 200);

                });
        }
    }

    get_emails_outbox() {
        if (this.outbox == null) {
            this._adminService.getEmailLogs(this.id, 'outbox')
                .subscribe((result) => {
                    this.outbox = result;
                    setTimeout(function () {
                        jQuery('#outbox-datatable').DataTable();
                    }, 200);
                });
        }
    }
}
