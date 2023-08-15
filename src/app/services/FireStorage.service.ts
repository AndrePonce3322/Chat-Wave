/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import {
  Storage,
  UploadTask,
  UploadTaskSnapshot,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FireStorageService {
  // Variables
  uploadTask!: UploadTask;

  constructor(private storage: Storage) {}

  SendImageToFireStorage(Event: any, _userId: string) {
    const file: File = Event.target.files[0];

    const imgRef = ref(this.storage, `images/${_userId}/${file.name}`);

    return uploadBytes(imgRef, file);
  }

  SendVideoToFireStorage(Event: any, _userId: string) {
    const file: File = Event.target.files[0];

    const videoRef = ref(this.storage, `videos/${_userId}/${file.name}`);

    this.uploadTask = uploadBytesResumable(videoRef, file);

    const progress = new Observable<UploadTaskSnapshot>((observer) => {
      this.uploadTask.on('state_changed', {
        next: (snapshot) => {
          return observer.next(snapshot);
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });

    const uploadBytes = this.uploadTask;

    return { progress, uploadBytes };
  }

  CancelUpload() {
    return this.uploadTask.cancel();
  }
}
