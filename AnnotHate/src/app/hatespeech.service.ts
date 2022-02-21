import { Injectable } from '@angular/core';

import firebase from 'firebase/compat/app';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from './user.model';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from './utils.service';
import { Data } from './data.module';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HatespeechService {


  constructor(private utilsService: UtilsService,
              private afAuth: AngularFireAuth,
              private firestore: AngularFirestore) { }

  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    
    if ((credentials.user != null) &&
          (credentials.user.displayName != null) &&
          (credentials.user.email != null)) {
            
            const isAnnotator = (await this.checkIfAnnotator(credentials.user.email)).valueOf();
            if (!isAnnotator) { return false } // user is not annotator so he's not allowed to access the website

            const isAdmin = (await this.checkIfAdmin(credentials.user)).valueOf();
            this.utilsService.setUser({
              uid: credentials.user.uid,
              displayName: credentials.user.displayName,
              email: credentials.user.email,
              admin: isAdmin,
              annotator: isAnnotator,
              labelledDatas: undefined
            });
            this.updateUserData(this.utilsService.getUser())

            return true
  
    }

    return false

  }

  signOutWithGoogle() {
    this.afAuth.signOut();
  }

  async checkIfAdmin(user: firebase.User) {

    const snapshot = await firstValueFrom(this.firestore
      .collection("user")
      .doc(user.uid)
      .get()
    );
    // return true if user exists AND admin attribute is set to true. 
    // Return false if attribute is not defined yet (so it's not admin)
    if (snapshot.exists && snapshot.get("admin")) {return true} else {return false}

  }

  async checkIfAnnotator(email: string) {

    const annotatorID: string = email!.replace(/[^a-zA-Z0-9]/g, '');
    const snapshot = await firstValueFrom(this.firestore
      .collection("annotators")
      .doc(annotatorID)
      .get()
    );
    // return true if user exists in annotator collection of firebase
    // This means the user is an annotator
    return snapshot.exists

  }

  getLabelledDatas(user: User) {

    return this.firestore.collection<User>("user").doc(user.uid).collection("labelledDatas").valueChanges()

  }

  updateUserData(user: User) {

    this.firestore.collection("user").doc(user.uid).set(
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        admin: user.admin,
        annotator: user.annotator,
      }, {merge: true})

  }

  getDataset(){
    return this.firestore.collection<Data>("dataset").valueChanges();
  }

  
  async doesDataExist(docID: string) {

    const snapshot = await firstValueFrom(this.firestore
      .collection("dataset")
      .doc(docID)
      .get()
    );
    return snapshot.exists;

  }
  
  async addData(data: Data){

    let docID = data.videoID!.toString();
    let status = await this.doesDataExist(docID);
    if (status) {
      return false  
    }
    else {
      this.firestore.collection<Data>("dataset").doc(docID).set(data)
      return true
    }

  }
  /*
  addData(data:Data) {
    this.firestore.collection("dataset").add(data);
  }
  */

  updateData(newData: Data) {
    this.firestore.collection("dataset").doc(newData.videoID?.toString()).set(newData, {merge: true})
  }

  getUsers(){

    return this.firestore.collection<User>("user").valueChanges();

  }

  addDataToUserDatas(user: User, data: Data, label: number) {

    this.firestore.collection("user")
                  .doc(user.uid)
                  .collection("labelledDatas")
                  .doc(data.videoID?.toString())
                  .set({dataID: data.videoID?.toString(),
                        URL: data.URL,
                        label: label})

  }

  async addAnnotator(email: string) {

    const annotatorID: string = email.replace(/[^a-zA-Z0-9]/g, '');
    this.firestore.collection("annotators").doc(annotatorID).set({email: email}, {merge: true})
    const queryUser = await firstValueFrom(this.firestore.collection<User>("user", ref => ref.where('email', '==', email)).get());
    if (queryUser.empty) {
      console.log("no user found")
    }
    else {
      let uid: string | null;
      queryUser.forEach(doc => {uid = doc.data().uid});
      this.firestore.collection("user").doc(uid!).set({annotator: true}, {merge: true});
    }
  }

  deleteAnnotator(user: User) {

    const annotatorID: string = user.email.replace(/[^a-zA-Z0-9]/g, '');
    this.firestore.collection("annotators").doc(annotatorID).delete();
    this.firestore.collection("user").doc(user.uid).delete();

  }

}
