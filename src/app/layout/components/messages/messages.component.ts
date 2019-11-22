import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// @Ngrx
import { Store } from '@ngrx/store';
import { AppState } from './../../../core/@ngrx';
import * as RouterActions from './../../../core/@ngrx/router/router.actions';


import { MessagesService } from '../../../core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  message = '';

  constructor(
    public messagesService: MessagesService,
    private store: Store<AppState>
    // private router: Router
  ) {}

  ngOnInit() {}

  onClose() {
    // this.router.navigate([{ outlets: { messages: null } }]);
    this.store.dispatch(RouterActions.go({
      path: [{ outlets: { messages: null } }]
    }));

    this.messagesService.isDisplayed = false;
  }

  onSend() {
    if (this.message) {
      this.messagesService.addMessage(this.message);
      this.message = '';
    }
  }
}
