import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Store, select } from '@ngrx/store';
import * as UsersActions from './../../../core/@ngrx/users/users.actions';
import { AppState, selectUsers, selectUsersError, selectEditedUser } from './../../../core/@ngrx';

// rxjs
import { Observable, Subscription, of } from 'rxjs';
import { AutoUnsubscribe } from './../../../core/decorators';
import { switchMap } from 'rxjs/operators';

import { UserModel, User } from './../../models/user.model';
import { UserObservableService } from './../../services';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
@AutoUnsubscribe('subscription')
export class UserListComponent implements OnInit {
  users$: Observable<Array<UserModel>>;
  usersError$: Observable<Error | string>;

  private editedUser: UserModel;
  private subscription: Subscription;

  constructor(
    private store: Store<AppState>,
    // private userObservableService: UserObservableService,
    private router: Router,
    // private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.users$ = this.userObservableService.getUsers();

    // // listen editedUserID from UserFormComponent
    // const observer = {
    //   next: (user: UserModel) => {
    //     this.editedUser = { ...user };
    //     console.log(
    //       `Last time you edited user ${JSON.stringify(this.editedUser)}`
    //     );
    //   },
    //   error: (err: any) => console.log(err)
    // };
    // this.route.paramMap
    //   .pipe(
    //     switchMap((params: ParamMap) => {
    //       return params.get('editedUserID')
    //         ? this.userObservableService.getUser(+params.get('editedUserID'))
    //         : of(null);
    //     })
    //   )
    //   .subscribe(observer);

    this.users$ = this.store.pipe(select(selectUsers));
    this.usersError$ = this.store.pipe(select(selectUsersError));
    this.store.dispatch(UsersActions.getUsers());

    this.subscription = this.store.pipe(select(selectEditedUser)).subscribe({
      next: user => {
        this.editedUser = { ...user };
        console.log(
          `Last time you edited user ${JSON.stringify(this.editedUser)}`
        );
      },
      error: err => console.log(err)
    });

  }

  onEditUser(user: UserModel) {
    const link = ['/users/edit', user.id];
    this.router.navigate(link);
    // or
    // const link = ['edit', user.id];
    // this.router.navigate(link, {relativeTo: this.route});
  }

  isEdited(user: UserModel): boolean {
    if (this.editedUser) {
      return user.id === this.editedUser.id;
    }
    return false;
  }

  onDeleteUser(user: UserModel) {
    // this.users$ = this.userObservableService.deleteUser(user);
    const userToDelete: User = { ...user };
    this.store.dispatch(UsersActions.deleteUser({ user: userToDelete }));

  }
}
