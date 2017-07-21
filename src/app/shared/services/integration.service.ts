import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import {BaseService} from "./base.service";
import {CookieService} from "./cookie.service";
import {SubDomainService} from "./subdomain.service";


@Injectable()
export class IntegrationService extends BaseService {

     constructor(
      public _http: Http, public _cookieService: CookieService, public _subdomainService: SubDomainService
    ) {
        super();
    }

    getLink(data: any, type: string) {
        let company  = this._subdomainService.subDomain.company_id;
        let url = this._url + '/integration/getlink/' + type + '/'  + company ;
        return this._http.post(url, data, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    authorization(data: any, type: string, companyId: string = null) {
        let company  = this._subdomainService.subDomain.company_id;
        if (companyId !== null) {
            company = companyId;
        }
        let url = this._url + '/integration/auth/' + type + '/' + company;
        return this._http.post(url, data, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    getCalcIntegrations(appId: String) {
        let url = this._url + '/integration/' + appId;
        return this._http.get(url, this.get_options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

  getTasksList(data: any) {
    return this._http.post(this._url + '/integration/getTasksList/', data,
      this.get_options()).map(this.extractData).catch(this.handleError);
  }

  getTasksLeadStatus(data: any) {
    return this._http.post(this._url + '/integration/getTasksLeadStatus',
      data, this.get_options()).map(this.extractData).catch(this.handleError);
  }

    updateCalcIntegrations(data: any, appId: String){
        let url = this._url + '/integration/' + appId;
        return this._http.put(url, data, this.put_options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

    getAllConfiguration(){
        let company  = this._subdomainService.subDomain.company_id;
        let url = this._url + '/integration/getIntegrations/' + company;
        return this._http.get(url, this.get_options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

    connectMarketo(data: any) {
        return this._http.post(this._url + '/integration/marketo/auth', data, this.post_options())
        .map(this.extractData)
        .catch(this.handleError);
    }


    testSaveLead(type: string, appId: any,data:any) {
        let url = this._url + '/integration/test/' + type + '/' + appId;
        return this._http.post(url, data, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    getCompanySyncLeads() {
        let company  = this._subdomainService.subDomain.company_id;
        let url = this._url + '/integration/sync/count/company/' + company;
        return this._http.get(url, this.get_options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

    getCalcSyncLeads(calc: string) {
        let url = this._url + '/integration/sync/count/calc/' + calc;
        return this._http.get(url, this.get_options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

   syncLeads(type: string) {
        let company  = this._subdomainService.subDomain.company_id;
        let data = {};
        let url = this._url + '/integration/sync/log/company/' +  type + '/' + company;
        return this._http.post(url, data, this.options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

  syncCalcLeads(type: String, appId: String, integrationLogId?: any, integrationData?: any) {
    let url;
    if (integrationLogId == null) {
      url = this._url + '/integration/sync/log/calc/' + type + '/' + appId;
    } else {
      url = this._url + '/integration/sync/log/calc/' + type + '/' + appId + '/' + integrationLogId;
    }
    return this._http.post(url, integrationData, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCalTestData(type: string, appId: String,) {
        let url = this._url + '/integration/calc/config/' + type + '/' + appId;
        return this._http.get(url, this.get_options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

    getConfiguration() {
        let company  = this._subdomainService.subDomain.company_id;
        let url = this._url + '/integration/getIntegrations/' + company;
        return this._http.get(url, this.get_options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

    getCalcMapFields(type: string, appId: String, data : any = {}) {
        let url = this._url + '/integration/fields/get/' +  type + '/' + appId;
        return this._http.post(url,data,this.options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

    getMapFieldsLimited(type: string, appId: String) {
        let url = this._url + '/integration/fields/limited/' +  type + '/' + appId;
        return this._http.get(url, this.get_options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

    sendMapFields(type: string, appId: string, data: any) {
        let url = this._url + '/integration/fields/save/' +  type + '/' + appId;
        return this._http.post(url, data, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
    getList(type:string, data: any = null){
        let sendData ={};
        if(data !== null) {
            sendData = data ;
        }else{
            sendData = {};
        }
        let company  = this._subdomainService.subDomain.company_id;
        let url = this._url + '/integration/getList/' +  type + '/' + company;
        return this._http.post(url, sendData, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    getCalcBasicFields(type: string, appId: String, data:any = {}) {
        let url = this._url + '/integration/fields/limited/' +  type + '/' + appId;
        return this._http.post(url,data,this.options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

    sendTestLeads(type:string, data:any, appId:string){
        let company  = this._subdomainService.subDomain.company_id;
        let url = this._url + '/integration/testLead/send/' +  type + '/' + company;
        return this._http.post(url, data, this.get_options)
                         .map(this.extractData)
                        .catch(this.handleError);

    }

    testSaveLeadBasic(type: string, appId: any, fields :any, listId:any) {
        let data = {
            'map_fields' : fields,
            'list_id' : listId
        }
        let url = this._url + '/integration/test/lead/' + type + '/' + appId;
        return this._http.post(url, data, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    sendMapFieldsBasic(type: string, appId: string, data:any ) {
         /*let sendData = {
            'map_fields' : fields,
            'list_id' : data.list_id,
            'account' : data.account_id
        }*/
        //console.log(data,'$$$$$$$$$$$$$$$$$$$$$')
        let url = this._url + '/integration/basicfields/save/' +  type + '/' + appId;
        return this._http.post(url, data, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

      getAccount(type: string) {
        let company  = this._subdomainService.subDomain.company_id;
        let url = this._url + '/integration/account/' +  type + '/' + company;
        return this._http.get(url, this.get_options)
                         .map(this.extractData)
                        .catch(this.handleError);
    }

     saveList(type: string, appId: string, data: any) {
        let url = this._url + '/integration/list/save/' +  type + '/' + appId;
        return this._http.post(url, data, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
}
