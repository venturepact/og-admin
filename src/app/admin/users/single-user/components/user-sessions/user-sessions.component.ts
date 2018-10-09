import { UserService } from './../../../../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-sessions',
  templateUrl: './user-sessions.component.html',
  styleUrls: ['./user-sessions.component.css']
})
export class UserSessionsComponent implements OnInit {
  sessions = [];
  id;

  constructor(    public _userService: UserService,
    public route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.getSessions(this.id);

  }
  getSessions(id = this.id){
    const $sessions =  this._userService.getUserSession(id).subscribe((sessions)=>{
      this.sessions = sessions || [];
      console.log(this.sessions);
      $sessions.unsubscribe();
    },error=>{
      $sessions.unsubscribe();
    });
  }
  getBrowserSessions(sessions){
    return Object.keys(sessions);
  }
  destroySession(session,browser){
    console.log(session);
    const $session = this._userService.removeUserSession({session:session['sessionId'],browser,user:this.id})
      .subscribe(res=>{
       $session.unsubscribe();
       this.getSessions();
      },err=>{
        $session.unsubscribe();
      })
  }
}
