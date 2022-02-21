import firebase from 'firebase/compat/app';

type Timestamp = firebase.firestore.Timestamp

export class Data{

    URL: string;
    videoID: number | null;
    date: Timestamp;
    audioID: string | null;
    label1: number | null;
    label2: number | null;
    label3: number | null;
    countLabel: number;

    constructor(URL: string,
                videoID: number | null,
                date: Timestamp,
                audioID: string | null,
                label1: number | null,
                label2: number | null,
                label3: number | null,
                countLabel: number){

                    this.URL = URL;
                    this.date = date;
                    this.audioID = audioID;
                    this.label1 = label1;
                    this.label2 = label2;
                    this.label3 = label3;
                    this.countLabel = countLabel;
                    this.videoID = videoID;

                }

}