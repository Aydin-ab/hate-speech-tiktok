import { Component, OnInit } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { Data } from '../data.module';
import { HatespeechService } from '../hatespeech.service';
import { User } from '../user.model';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {

  user: User | undefined | null;
  isRoot: boolean = false;
  dataset: Data[] | undefined;
  displayDataset: Data[] | undefined | null;

  constructor(private utilsService: UtilsService,
              private hatespeechService: HatespeechService,
              private router: Router) {}

  ngOnInit(): void {

    // Load User and check if root privilege
    this.user = this.utilsService.getUser()!;
    if ((this.user.email == 'gilbert.badaro@gmail.com') 
      || (this.user.email == 'aydinabiar@gmail.com')) {
        this.isRoot = true
      }

    // Get Dataset
    this.hatespeechService.getDataset()
    .subscribe((dataset: Data[]) => {
      this.dataset = dataset;
      this.displayDataset = this.utilsService.getDisplayDataset(this.dataset);
    });

  }

  signOut() {

    this.hatespeechService.signOutWithGoogle();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["signin"]);

  }

  addLabel(data: Data) {

    const selection = <HTMLSelectElement> document.getElementById('label+'.concat(data.URL));
    const selected_label = parseInt(selection.value);

    // No label chosen
    if (selected_label == 0) {
      return
    }

    // Update data with new label
    const newData = this.utilsService.buildNewData(data, selected_label)
    this.hatespeechService.updateData(newData)

    // Add data to user's dataset for tracking
    this.hatespeechService.addDataToUserDatas(this.user!, newData, selected_label)

  }

}
