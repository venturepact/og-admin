import { Injectable } from '@angular/core';
import { LoggedIn } from './../interfaces/logged-in.interface';
import { isLoggedin } from './../authentication/is-loggedin';


@Injectable()
export class LoggedInService {
    loggedIn: LoggedIn = { isLoggedIn: false };

    constructor() {
        if(isLoggedin()) {
            this.loggedIn.isLoggedIn = true;
        }
    }

    login() {
        //console.log('inside logged in service');
        if(isLoggedin()) this.loggedIn.isLoggedIn = true;
    }

    logout() {
        this.loggedIn.isLoggedIn = false;
    }
}
