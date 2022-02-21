import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HatespeechService } from '../hatespeech.service';
import { User } from '../user.model';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-root-panel',
  templateUrl: './root-panel.component.html',
  styleUrls: ['./root-panel.component.css']
})
export class RootPanelComponent implements OnInit {


  user: User | undefined | null;

  users: User[] | undefined;
  admins: User[] | undefined;
  annotatorsOnly: User[] | undefined;

  addAdminEmail: string | undefined;
  notSignedInYetMessage: boolean = false;

  constructor(private utilsService: UtilsService,
              private hatespeechService: HatespeechService,
              private router: Router) { }

  ngOnInit(): void {

    this.user = this.utilsService.getUser()!;

    this.hatespeechService.getUsers().subscribe( (users: User[]) => {
      this.users = users;
      this.admins = this.utilsService.getAdmins(this.users);
      this.annotatorsOnly = this.utilsService.getAnnotatorsOnly(this.users);
    })

  }

  signOut() {

    this.hatespeechService.signOutWithGoogle();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["signin"]);

  }

  deleteAdmin(admin: User) {

    const newUser = this.utilsService.deletedAdminPrivilege(admin);
    this.hatespeechService.updateUserData(newUser);

  }

  addAdmin() {

    this.notSignedInYetMessage = false;

    if (!(this.addAdminEmail)) {
      return
    }

    let hasSignedIn: boolean = false;

    for (let user of this.users!) {
      if (user.email == this.addAdminEmail) {
        hasSignedIn = true
        user.admin = true;
        this.hatespeechService.updateUserData(user);
        break;
      };
    }

    if (!hasSignedIn) {
      // User has not signed in yet
      this.notSignedInYetMessage = true;
    }
    this.addAdminEmail = undefined;

  }

}
