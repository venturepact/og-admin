import { Component, OnInit } from '@angular/core';
import { Datatable } from './../../shared/interfaces/datatable.interface';
import { PremaidService } from "./../../shared/services/premaid.service";
@Component({
    selector: 'app-premaid',
    templateUrl: './premaid-calc.component.html'
})

export class PremaidComponent extends Datatable implements OnInit {
    loading: boolean = true;
    btnText = "Save Tags";
    premaidListArray: any = [];
    constructor(private _premaidService: PremaidService) {
        super();
    }
    ngOnInit() {
        this.loading = true;
        this.premaidListArray = [];
        let self = this;
        this._premaidService.getPremaidList()
            .subscribe(result => {
                self.premaidListArray = result;
                self.loading = false;
            }, err => {
                console.log('Premaid list fetch error');
                self.loading = false;
            })
    }

    saveTag() {
        this.btnText = "Updating Please Wait...";
        this._premaidService.saveTag({updateArray: this.premaidListArray})
            .subscribe(result => this.btnText = "Save Tag", err => {
                this.btnText = "Save Tag";
                console.log('Save error');
            });
    }
}
