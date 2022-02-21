import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { SigninComponent } from './signin/signin.component';
import { DatasetComponent } from './dataset/dataset.component';
import { AddDataComponent } from './add-data/add-data.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { RootPanelComponent } from './root-panel/root-panel.component';
import { AnnotationComponent } from './annotation/annotation.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    DatasetComponent,
    AddDataComponent,
    AdminPanelComponent,
    RootPanelComponent,
    AnnotationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
