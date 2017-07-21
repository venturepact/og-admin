// import {Leads} from "./leads";
// import {Traffic} from "./traffic";

// export class UsersCompany{
//   public id: String;
//   public updatesAt: Date;
//   public createdAt: Date;
//   public name: String;
//   public sub_domain: String;
//   public leads: Leads;
//   public traffic: Traffic;
//   public agency: boolean;
//   public user_company: UserDetails;
//   constructor(usersCompany: any) {
//     this.id = usersCompany._id;
//     this.updatesAt = usersCompany.updatedAt;
//     this.createdAt = usersCompany.createdAt;
//     this.name = usersCompany.name;
//     this.sub_domain = usersCompany.sub_domain,
//     this.leads = new Leads(usersCompany.leads);
//     this.traffic = new Traffic(usersCompany.traffic);
//     this.agency = usersCompany.agency;
//     this.user_company = new UserDetails(usersCompany.user_company);
//   }
// }

// export class UserDetails{
//   public id: String;
//   public active: Boolean;
//   public updatedAt: Date;
//   public createdAt: Date;
//   public user: String;
//   public status: String;
//   public left_at: Date;
//   public deleted: Deleted;
//   public invite: Invite;
//   public role: String
//   constructor(userDetail: any){
//     this.id = userDetail._id;
//     this.active = userDetail.active;
//     this.updatedAt = userDetail.updatedAt;
//     this.createdAt = userDetail.createdAt;
//     this.user = userDetail.user;
//     this.status = userDetail.status;
//     this.left_at = userDetail.left_at;
//     this.deleted = new Deleted(userDetail.deleted)
//     this.invite = new Invite(userDetail.invite);
//     this.role = userDetail.role;
//   }
// }

// export class Deleted{
//   public at: Date;
//   constructor(deleted: any){
//     this.at = deleted.at;
//   }
// }
// export class Invite{
//   public request_from: String;
//   public requested_by: String;
//   public approved_by: String;
//   public approved_at: String;
//   public requested_at: String;
//   constructor(invite: any){
//     this.request_from = invite.request_from;
//     this.requested_by = invite.requested_by;
//     this.approved_by = invite.approved_by;
//     this.approved_at = invite.approved_at;
//     this.requested_at = invite.requested_at;
//   }
// }

export class UsersCompany{
  public id: String;
  public updatedAt: Date;
  public createdAt: Date;
  public user: String;
  public active: Boolean;
  public status: String;
  public left_at: Date;
  public role: String;
  public deleted: Deleted;
  public invite: Invite;
  public companyName:String;
  public domain: String;
  constructor(users_company:any){
    if(users_company){
      this.id = users_company._id;
      this.updatedAt = users_company.updatedAt;
      this.createdAt = users_company.createdAt;
      this.user = users_company.user;
      this.active = users_company.active;
      this.status = users_company.status;
      this.left_at = users_company.left_at;
      this.role = users_company.role;
      this.deleted = new Deleted(users_company.deleted);
      this.invite = new Invite(users_company.invite);
      this.companyName = users_company.companyName;
      this.domain = users_company.domain;
    }
  }
}

export class Deleted{
  public at: Date;
  constructor(deleted: any){
    if(deleted)
      this.at = deleted.at;
  }
}

export class Invite{
  public request_from: String;
  public requested_by: String;
  public approved_by: String;
  public approved_at: Date;
  public requested_at: Date;
  constructor(invite: any){
    if(invite){
      this.request_from = invite.request_from;
      this.requested_at = invite.requested_at;
      this.approved_by = invite.approved_by;
      this.approved_at = invite.approved_at;
      this.requested_at = invite.requested_at;
    }
  }
}


