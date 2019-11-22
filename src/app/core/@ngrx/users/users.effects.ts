import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// @NgRx
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UsersActions from './users.actions';
import * as RouterActions from './../router/router.actions';

// Rxjs
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, concatMap, pluck } from 'rxjs/operators';

import { UserObservableService } from './../../../users/services';
import { UserModel } from '../../../users/models/user.model';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private userObservableService: UserObservableService,
    // private router: Router
  ) {
    console.log('[USERS EFFECTS]');
  }

  getUsers$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.getUsers),
      switchMap(action =>
        this.userObservableService.getUsers().pipe(
          map(users => UsersActions.getUsersSuccess({ users })),
          catchError(error => of(UsersActions.getUsersError({ error })))
        )
      )
    )
  );

  updateUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      pluck('user'),
      concatMap((user: UserModel) =>
        this.userObservableService.updateUser(user).pipe(
          map(updatedUser => {
            // this.router.navigate(['/users', { editedUserID: updatedUser.id }]);
            return UsersActions.updateUserSuccess({ user: updatedUser });
          }),
          catchError(error => of(UsersActions.updateUserError({ error })))
        )
      )
    )
  );

  createUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      pluck('user'),
      concatMap((user: UserModel) =>
        this.userObservableService.createUser(user).pipe(
          map(createdUser => {
            // this.router.navigate(['/users']);
            return UsersActions.createUserSuccess({ user: createdUser });
          }),
          catchError(error => of(UsersActions.createUserError({ error })))
        )
      )
    )
  );

  deleteUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      pluck('user'),
      concatMap((user: UserModel) =>
        this.userObservableService.deleteUser(user).pipe(
          // Note: json-server doesn't return deleted user
          // so we use user
          map(() => UsersActions.deleteUserSuccess({ user })),
          catchError(error => of(UsersActions.deleteUserError({ error })))
        )
      )
    )
  );

  createUpdateUserSuccess$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUserSuccess, UsersActions.updateUserSuccess),
      map(action => {
        const userID = action.user.id;
        const actionType = action.type;
        let path: any[];

        if (actionType === '[Update User Effect] UPDATE_USER_SUCCESS') {
          path = ['/users', { editedUserID: userID }];
        } else {
          path = ['/users'];
        }

        return RouterActions.go({ path });
      })
    )
  );

}
