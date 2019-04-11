import {Emails} from './../models/emails';
import {UsersCompany} from './userCompany';
export class User {
  public id: String;
  public updatedAt: Date;
  public createdAt: Date;
  public username: String;
  public timezone: String;
  public location: String;
  public phone: any;
  public role: String;
  public sub_role: String;
  public name: String;
  public emails: Emails[];
  public user_company: UsersCompany;
  public isLoggedIn: Boolean;
  public active: Boolean;
  public password: string;
  public can_create_new_company: Boolean;
  public is_admin_created: Boolean;
  public last_login: Date;
  public two_fact_auth : Two_Fact_Auth;
  public can_use_default_password : boolean;
  constructor(user: any){
    if(user){
      this.id = user._id;
      this.updatedAt = user.updatedAt;
      this.createdAt = user.createdAt;
      this.username = user.username;
      this.timezone = user.timezone;
      this.location = user.location;
      this.phone = user.phone;
      this.role = user.role;
      this.sub_role = user.sub_role;
      this.name = user.name;
      this.isLoggedIn = user.isLoggedIn;
      this.password = user.password;
      this.active = user.active;
      this.can_create_new_company = user.can_create_new_company;
      this.is_admin_created = user.is_admin_created;
      this.last_login = user.last_login;
      this.emails = [];
      this.two_fact_auth = new Two_Fact_Auth(user.two_fact_auth);
      this.can_use_default_password = user.can_use_default_password;
      let i = 0;
      if(user.emails){
        user.emails.forEach((email: Emails) =>{
          this.emails[i] = new Emails(email);
          i++;
        });
      }
      this.user_company = new UsersCompany(user.user_company);
    }
  }
}

export class Two_Fact_Auth {
  public attempts:Number;
  public created_at:Date;
  public is_configured:Boolean;
  public activation:Boolean;
  public recovery_codes:any;
  public secret:{
    otpauth_url:any;
    base32:any;
    hex:any;
    ascii:any;
  }
  constructor(two_fact_auth:any) {
    if(two_fact_auth){
      this.attempts = two_fact_auth.attempts; 
      this.created_at = two_fact_auth.created_at;
      this.is_configured = two_fact_auth.is_configured ;
      this.activation = two_fact_auth.activation ;
      this.recovery_codes = two_fact_auth.recovery_codes ? two_fact_auth.recovery_codes : {};
      this.secret = two_fact_auth.secret ? two_fact_auth.secret : null;
    }
  }
}

