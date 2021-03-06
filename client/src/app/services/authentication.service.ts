﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PushService } from './../services/push.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
  apiUrl = environment.apiUrl;
  private  userAuthorized = new BehaviorSubject<boolean>(this.getUserLoggedIn());
  cast = this.userAuthorized.asObservable();

  constructor(
    private http: HttpClient,
    private pushService: PushService
  ) { }

  editUserAuthorized(value: boolean) {
    this.userAuthorized.next(value);
  }

  getUserLoggedIn() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  loginSubRequest() {
    this.pushService.getEndPoint()
      .then(pushSubscription => {
        if (pushSubscription) {
          // browser already have endpoint
          this.pushService.getUserSubscribed(pushSubscription.endpoint)
            .subscribe(
              res => {
                if (res.subscribed === false) {
                  this.pushService.confirmPushSubscribe();
                }
              },
              err => console.log(err)
            )
        } else {
          // browser don't have endpoint
          this.pushService.generatePush()
            .then(res => {
              this.pushService.confirmPushSubscribe()
            })
        }
      });
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.apiUrl + 'login', {email: email, password: password})
      .map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));

          if ('serviceWorker' in navigator && environment.production) {
            this.loginSubRequest();
          }
        }
        this.editUserAuthorized(this.getUserLoggedIn());
        return user;
      });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.editUserAuthorized(this.getUserLoggedIn());
  }
}
