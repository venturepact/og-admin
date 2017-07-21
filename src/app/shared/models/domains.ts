export class Domains{
	id:String;
	updatedAt:String;
	createdAt:String;
	sub_domain:String;
	access:String;
	constructor(domain:any){
		if(domain){
			this.id = domain._id;
			this.updatedAt = domain.updatedAt;
			this.createdAt = domain.createdAt;
			this.sub_domain = domain.sub_domain;
			this.access = domain.access;
		}
	}
}