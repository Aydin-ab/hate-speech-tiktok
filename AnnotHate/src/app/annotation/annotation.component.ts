import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HatespeechService } from '../hatespeech.service';
import { User } from '../user.model';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.css']
})
export class AnnotationComponent implements OnInit {

  user: User | undefined | null; 
  isRoot: boolean | undefined;

  constructor(private utilsService: UtilsService,
              private hatespeechService: HatespeechService,
              private router: Router) { }

  ngOnInit(): void {

    // Load User and check if root privilege
    this.user = this.utilsService.getUser()!;
    if ((this.user.email == 'gilbert.badaro@gmail.com') 
      || (this.user.email == 'aydinabiar@gmail.com')) {
        this.isRoot = true
      }

  }

  signOut() {

    this.hatespeechService.signOutWithGoogle();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["signin"]);

  }

}
