import { Injectable } from '@angular/core';
import { concat } from 'rxjs';
import { Data } from './data.module';
import { HatespeechService } from './hatespeech.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private user: User | undefined;

  constructor() { }


  userSignedIn() {

    return JSON.parse(localStorage.getItem("user")!) != null;

  }

  getUser() {

    if ((this.user === undefined) && this.userSignedIn()) {
      this.user = JSON.parse(localStorage.getItem("user")!);
    }
    return this.user!
    
  }

  setUser(user: User) {
    this.user = user
  }

  getDisplayDataset(dataset: Data[] | undefined) {
    
    let displayDataset: Data[] = [];
    dataset?.forEach( (data) => {
      if (data.countLabel == 0 || data.countLabel == 1 || data.countLabel == 2) {
        displayDataset.push(data)
      }
    });

    return displayDataset;

  }

  getDownloadDataset(dataset: Data[] | undefined) {

    let downloadDataset: Data[] = [];
    dataset?.forEach( (data) => {
      if (data.countLabel >= 3) {
        downloadDataset.push(data)
      }
    });

    return downloadDataset;

  }

  buildNewData(data: Data, selected_label: number) {

    let newData = data;
    
    if (data.countLabel == 0) {newData.label1 = selected_label}
    else if (data.countLabel == 1) {newData.label2 = selected_label}
    else if (data.countLabel == 2) {newData.label3 = selected_label }
    newData.countLabel = data.countLabel + 1;

    return newData

  }

  downloadCSV(downloadDataset: Data[]){

    const header: string = 'URL, label1, label2, label3\n';
    let csvLines: string[] = [header];

    downloadDataset.forEach( (data) => {
      const row: string = [data.URL, data.label1, data.label2, data.label3].join(',').concat('\n');
      csvLines.push(row)
    });

    const blob = new Blob(csvLines, { type: 'text/csv;encoding:utf-8' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "annotHate_dataset";
    anchor.click();    

  }

  getAdmins(users: User[] | undefined){
    
    let admins: User[] = [];
    users?.forEach( (user) => {
      if (user.admin == true) {
        admins.push(user)
      }
    });

    return admins

  }

  getAnnotatorsOnly(users: User[] | undefined) {

    let annotators: User[] = [];
    users?.forEach( (user) => {
      if ((user.annotator == true) && 
          ((user.admin == false) || (user.admin === undefined))) {
        annotators.push(user)
      }
    } );

    return annotators

  }

  deletedAdminPrivilege(admin: User) {

    admin.admin = false;
    return admin

  }

  deletedAnnotatorPrivilege(annotator: User) {

    let newUser = this.deletedAdminPrivilege(annotator);
    newUser.annotator = false;
    return newUser

  }

}
