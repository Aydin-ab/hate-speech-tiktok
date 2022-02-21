import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HatespeechService } from '../hatespeech.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  errorAnnotatorMessage: boolean = false

  constructor(private utilsService: UtilsService,
              private hatespeechService: HatespeechService,
              private router: Router) { }

  ngOnInit(): void {
  }

  async signInWithGoogle () {
    this.errorAnnotatorMessage = false;

    const status: boolean = await this.hatespeechService.signInWithGoogle();
    if (!status) { 
      // User is not annotator. He's not allowed to log in
      this.errorAnnotatorMessage = true;
    } 
    else {
      localStorage.setItem("user", JSON.stringify(this.utilsService.getUser()));
      this.router.navigate(["dataset"]);
    }
  }

}
