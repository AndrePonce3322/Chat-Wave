import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface UserData {
  _id: string | null;
  img: string | null;
  email: string | null;
  name: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ShareUserDataService {
  CurrentUser = new Subject<UserData>();
}
