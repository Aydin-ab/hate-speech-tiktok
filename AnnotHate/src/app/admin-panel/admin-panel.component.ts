import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from '../data.module';
import { HatespeechService } from '../hatespeech.service';
import { User } from '../user.model';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  user: User | undefined | null;
  isRoot: boolean = false;

  init: boolean = true;

  addAnnotatorEmail: string | undefined;
  errorAlreadyAnnotatorMessage: boolean = false;
  successAddAnnotatorMessage: boolean = false;

  selectedUserName: string | undefined;
  trackData: (string|number)[][] = [];

  users: User[] | undefined;
  annotatorsOnly: User[] | undefined;

  dataset: Data[] | undefined;
  displayDataset: Data[] | undefined | null;
  downloadDataset: Data[] | undefined | null;

  constructor(private utilsService: UtilsService,
              private hatespeechService: HatespeechService,
              private router: Router) { }

  ngOnInit(): void {
    
    this.user = this.utilsService.getUser();
    if ((this.user.email == 'gilbert.badaro@gmail.com') 
    || (this.user.email == 'aydinabiar@gmail.com')) {
      this.isRoot = true
    };

    this.hatespeechService.getUsers().subscribe( (users: User[]) => {
      this.users = users;
      this.annotatorsOnly = this.utilsService.getAnnotatorsOnly(this.users);
    });

    // Get Dataset
    this.hatespeechService.getDataset()
    .subscribe((dataset: Data[]) => {
      this.dataset = dataset;
      this.displayDataset = this.utilsService.getDisplayDataset(this.dataset);
      this.downloadDataset = this.utilsService.getDownloadDataset(this.dataset);
    });
  }

  signOut() {

    this.hatespeechService.signOutWithGoogle();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["signin"]);

  }

  async addAnnotator() {

    this.errorAlreadyAnnotatorMessage = false;
    this.successAddAnnotatorMessage = false;

    if (!(this.addAnnotatorEmail)) {
      return
    }

    const isAnnotator: boolean = await this.hatespeechService.checkIfAnnotator(this.addAnnotatorEmail);

    if (isAnnotator) { 
      // User is already anotator
      this.errorAlreadyAnnotatorMessage = true 
    }
    else {
      this.hatespeechService.addAnnotator(this.addAnnotatorEmail);
      this.successAddAnnotatorMessage = true;
    }

    this.addAnnotatorEmail = undefined;

  }

  deleteAnnotator(annotator: User) {

    const newUser = this.utilsService.deletedAnnotatorPrivilege(annotator);
    this.hatespeechService.updateUserData(newUser);
    this.hatespeechService.deleteAnnotator(newUser);

  }

  displayTrack() {

    this.init = false;
    this.trackData = [];

    if ((this.selectedUserName === undefined) || (this.selectedUserName == null) ){return};

    // We find the user in the users database
    let selectedUser: User | null = null;
    for (let user of this.users!) {
      if (user.displayName == this.selectedUserName) {selectedUser = user; break}
    };

    // We find the videos the selected user annotated
    let labelledDatas = this.hatespeechService.getLabelledDatas(selectedUser!);
    labelledDatas?.subscribe( (datas) => {
      datas.forEach( (data) => {
        this.trackData.push([data["URL"] as string, data["dataID"] as string, data["label"] as number])
      });
    });
    
    return

  }

  downloadCSV() {

    if (this.downloadDataset) {
      this.utilsService.downloadCSV(this.downloadDataset);
    }

  }

}
