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

