import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Injectable()
export class SettingsCommunicationService {
    companyList: any;
    company$ = new BehaviorSubject<any>([]);
    updateCompanyList(companyList: any) {
        this.companyList = companyList;
        this.setCompany(this.companyList);
    }

  setCompany(companies: Company) {
    //const companies = [company, ...this.company$.getValue()];
    this.company$.next(companies);
  }
  // getCompany() {
  //   return this.company$.asObservable();
  // }
  // removeCompany(company: Company) {
  //   const companies = this.company$.getValue().filter(u => u !== company);
  //   this.company$.next(companies);
  // }
  // removeAllCompany() {
  //   this.company$.next(null);
  // }

}
