import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// importing components
import {SingleUserComponent} from './single-user.component';
import {AccountDetailsComponent} from './components/account-details/account-details.component';
import {CalculatorsComponent} from './components/calculators/calculators.component';
import {MembershipDetailsComponent } from './components/membership-details/membership-details.component';
import {OtherDetailsComponent} from './components/other-details/other-details.component';
import {TeamDetailsComponent} from './components/team-details/team-details.component';
import {UserLogComponent} from './components/user-logs/user-logs.component';
import {SharedModule} from './../../../shared/modules/shared.module';
import { UserSessionsComponent } from './components/user-sessions/user-sessions.component';


@NgModule({
  imports: [SharedModule, RouterModule],
  declarations: [ SingleUserComponent, AccountDetailsComponent,
                 CalculatorsComponent , MembershipDetailsComponent , OtherDetailsComponent , TeamDetailsComponent , UserLogComponent, UserSessionsComponent]
})

export class SingleUserModule {}