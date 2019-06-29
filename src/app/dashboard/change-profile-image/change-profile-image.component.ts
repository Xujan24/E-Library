import { DashboardComponent } from './../dashboard.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserAuthService } from './../../../services/user-auth.service';
import { Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-change-profile-image',
  templateUrl: './change-profile-image.component.html',
  styleUrls: ['./change-profile-image.component.scss']
})
export class ChangeProfileImageComponent implements OnInit {

  profileImageLink: Observable<string>;
  showUploader: boolean;
  uploadProgress: Observable<number>;
  constructor(
    private userAuth: UserAuthService,
    private afStorage: AngularFireStorage,
    private dashboard: DashboardComponent
  ) {
    this.userAuth.getCurrentUser().then(
      user => {
        if (user) {
          this.profileImageLink = of(user.photoURL);
        }
      }
    );
  }

  ngOnInit() {
  }

  onUpload(event) {
    this.userAuth.getCurrentUser()
    .then(user => {
      if (user) {
        const uid = user.uid;
        // create a reference
        const ref = this.afStorage.ref(uid);
        // upload the file to the storage reference path
        const task = ref.put(event.target.files[0]);
        // show the uploader prgress bar;
        this.showUploader = true;
        // obsreve percentage changes
        this.uploadProgress = task.percentageChanges();
        // get notified when the download url is available
        task.snapshotChanges().pipe(
          finalize(() => {
            this.profileImageLink = ref.getDownloadURL();
            this.showUploader = false;
            this.profileImageLink.subscribe(url => {
              this.dashboard.photoUrl = url;
              this.userAuth.updateProfilePhoto(url);
            });
          })
       ).subscribe();
      }
    })
    .catch(e => console.log(e.message));
  }

  toggleUploader() {
    this.showUploader = !this.showUploader;
  }

}
