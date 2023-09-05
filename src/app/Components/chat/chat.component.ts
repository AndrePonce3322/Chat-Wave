/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { getDownloadURL } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { timer } from 'rxjs';
import { DataBaseService } from 'src/app/services/database.service';
import { FireStorageService } from 'src/app/services/FireStorage.service';
import { SocketService } from 'src/app/services/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';

export interface Message {
  messageText: string;
  img?: string;
  video?: string;
  createdAt: Date;
  user: {
    name: string;
    img: string;
  };
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements AfterViewInit, OnInit {
  @ViewChild('Container') Container!: ElementRef;
  @ViewChild('input') Input!: ElementRef;
  @ViewChild('audio') Audio!: HTMLAudioElement;

  @HostListener('document:click', ['$event']) clickInside($event: Event) {
    if (this.Input.nativeElement.contains($event.target)) {
      this.showEmojiPicker = false;
      this.showUploadFile = false;
    }
  }

  constructor(
    private socket: SocketService,
    private database: DataBaseService,
    private FireStorageSVC: FireStorageService,
    private cdr: ChangeDetectorRef,
    private __snackBar: MatSnackBar,
    private authentication: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Get all messages
    this.database.getMessages().subscribe((data) => {
      this.messages = data.mesagges;
      this.GotoContainerBottom();
    });

    // Get all users
    this.database.getUsers().subscribe((data) => {
      this.UsersArray = data;
    });

    if (window.localStorage.getItem('user')) {
      const info = JSON.parse(window.localStorage.getItem('user') || '{}');
      this.user = {
        _id: info._id,
        name: info.name,
        img: info.img,
      };
    }

    // Get socket messages
    this.socket.getMessage().subscribe((data: any) => {
      const message = JSON.parse(data);
      this.messages.push(message);

      this.GotoContainerBottom();
    });
  }

  // Messages Variables
  messages: Array<Message> = [];

  // User Variables
  user = {
    _id: '',
    name: '',
    img: '',
  };

  UsersArray!: any;

  // Booleans
  showEmojiPicker!: boolean;
  showUploadFile!: boolean;
  ImageFullScreen: string | undefined;

  // Form
  MessageForm: FormGroup = new FormGroup({
    text: new FormControl('', [
      Validators.required,
      Validators.maxLength(1550),
    ]),
  });

  // Image SRC
  imageSrcFullScreen!: string;

  // Video Details
  videoDetails!: File | undefined;
  videoSize!: string;

  // Video Progress
  videoProgress = 0;

  // Functions
  ngAfterViewInit(): void {
    this.GotoContainerBottom();
  }

  sendMessage() {
    if (this.MessageForm.invalid) {
      return;
    }

    this.GotoContainerBottom();

    if (this.MessageForm.value.text.startsWith('./qrcode')) {
      this.MessageForm.reset();
      return console.log('QR CODE');
    }

    // Send Message
    const body = {
      messageText: this.MessageForm.value.text,
      _id: this.user._id,
      user: {
        name: this.user.name,
        img: this.user.img,
      },
      createdAt: this.CurrentDate(),
    };

    this.socket.sendMessage(body);
    this.showEmojiPicker = false;
    this.MessageForm.reset();
  }

  select($event: EmojiEvent) {
    const selectedEmoji = $event.emoji.native;
    const currentText = this.MessageForm.value.text || '';
    this.MessageForm.patchValue({ text: currentText + selectedEmoji });
  }

  showEmojiPickerMenu() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  showUploadFileMenu() {
    this.showUploadFile = !this.showUploadFile;
  }

  GotoContainerBottom() {
    timer(10).subscribe(() => {
      this.Container.nativeElement.scrollTop =
        this.Container.nativeElement.scrollHeight;
    });
  }

  SendImage(event: any) {
    const userID = this.user._id;

    this.FireStorageSVC.SendImageToFireStorage(event, userID).then((data) => {
      getDownloadURL(data.ref).then((url) => {
        // Send Message
        const body = {
          messageText: this.MessageForm.value.text,
          _id: this.user._id,
          img: url,
          user: {
            name: this.user.name,
            img: this.user.img,
          },
          createdAt: this.CurrentDate(),
        };

        this.socket.sendMessage(body);
        this.GotoContainerBottom();
        this.MessageForm.reset();
      });
    });

    // Hidden menu file
    this.showUploadFile = false;
  }

  SendVideo(event: any) {
    const userID = this.user._id;
    const file = event.target.files[0];
    this.videoDetails = file;
    this.videoSize = this.bytesToMegaBytes(file.size);

    this.GotoContainerBottom();

    // Video progress
    this.FireStorageSVC.SendVideoToFireStorage(
      event,
      userID
    ).progress.subscribe((data) => {
      const progress = Math.round(
        (data.bytesTransferred / data.totalBytes) * 100
      );
      this.videoProgress = progress;
      this.cdr.detectChanges();
    });

    this.FireStorageSVC.SendVideoToFireStorage(event, userID).uploadBytes.then(
      (data) => {
        getDownloadURL(data.ref).then((url) => {
          // Send Message
          const body = {
            messageText: this.MessageForm.value.text,
            _id: this.user._id,
            video: url,
            user: {
              name: this.user.name,
              img: this.user.img,
            },
            createdAt: this.CurrentDate(),
          };

          this.socket.sendMessage(body);
          this.GotoContainerBottom();
          this.MessageForm.reset();
          this.videoDetails = undefined;
        });
      }
    );

    // Hidden menu file
    this.showUploadFile = false;
  }

  FullScreenImage(message: string) {
    this.imageSrcFullScreen = message;
    console.log(message);
  }

  CloseFullScreenImage() {
    this.imageSrcFullScreen = '';
  }

  CurrentDate() {
    // Date
    const currentDateUTC = new Date();

    const currentDateMexico = new Date(
      currentDateUTC.toLocaleString('es-MX', {
        timeZone: 'America/Mexico_City',
      })
    );
    return currentDateMexico;
  }

  CancelVideoUpload() {
    this.FireStorageSVC.CancelUpload();
    this.videoDetails = undefined;
    this.openSnackBar('Video upload canceled successfully ✅');
  }

  openSnackBar(message: string) {
    this.__snackBar.open(message, 'close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  bytesToMegaBytes(bytes: number) {
    const megabytes = bytes / (1024 * 1024);
    return megabytes.toFixed(2);
  }

  logOut() {
    const question = confirm('Are you sure you want to log out?');

    if (question) {
      this.authentication.Logout();
    }
  }
}
