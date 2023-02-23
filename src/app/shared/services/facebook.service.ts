import { Injectable } from '@angular/core';

declare const FB: any;

@Injectable({
  providedIn: 'root',
})
export class FacebookService {
  constructor() {
    FB.init({
      appId: 'YOUR_APP_ID',
      cookie: true,
      xfbml: true,
      version: 'v11.0',
    });
  }

  loginWithFacebook() {
    
  }
}
