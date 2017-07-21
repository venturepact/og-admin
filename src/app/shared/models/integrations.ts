export class Integrations{
  public client_id: any;
  public client_secret: String;
  public instance_url: any;
  public type: any;
  public access_token: String;
  public api_key : string;
  public account : string;
  public tags : string;
  public refresh_token : string;
  constructor(integrations: any = null){
    if (integrations) {
        this.client_id = integrations.client_id;
        this.client_secret = integrations.client_secret;
        this.instance_url = integrations.instance_url;
        this.type = integrations.type;
        this.access_token = integrations.access_token;
        this.api_key = integrations.api_key;
        this.account = integrations.instance_url;
        this.tags = integrations.tags;
        this.refresh_token = integrations.refresh_token;
    }else{
        this.client_id = '';
        this.client_secret = '';
        this.instance_url  = '';
        this.type = '';
        this.access_token = '';
        this.api_key = '';
        this.account = '';
        this.tags = '';
        this.refresh_token = '';
    }
  }
}
