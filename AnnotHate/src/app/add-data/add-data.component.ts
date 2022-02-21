import { Component, OnInit } from '@angular/core';
import { Data } from '../data.module';

import { Timestamp } from 'firebase/firestore';
import { HatespeechService } from '../hatespeech.service';
import { UtilsService } from '../utils.service';


@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent implements OnInit {

  URL: string | undefined;
  successAddDataMessage: boolean = false;
  errorAddDataMessage: boolean = false;
  infoAlreadyExistDataMessage: boolean = false;

  constructor(private utilsService: UtilsService,
              private hatespeechService: HatespeechService) { }

  ngOnInit(): void {
  }

  async addData(){

    this.successAddDataMessage = false;
    this.errorAddDataMessage = false;
    this.infoAlreadyExistDataMessage = false;

    if (this.URL) {

      const matches = this.URL.match(/video\/([0-9]+)/);
      let videoID = null;
      if (matches) {
          videoID = parseInt(matches[1])
      }else {
        this.errorAddDataMessage = true;
        this.URL = undefined;
        return
      }

      let data: Data = {URL: this.URL,
        videoID: videoID, // videoID will be computed by constructor
        date: Timestamp.fromDate(new Date()), // Data of inserting data
        audioID: null, // TODO
        label1: null, // label1
        label2: null, // label2
        label3: null, // label3
        countLabel: 0} // countLabel = 0 (data is not labelled yet)

      let status = await this.hatespeechService.addData(data);
      if (!status) {this.infoAlreadyExistDataMessage = true; this.URL = undefined; return}
      this.URL = undefined;

      this.successAddDataMessage = true;

    }

  }

}
