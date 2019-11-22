import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';

// rxjs
import { Observable, of } from 'rxjs';
import { delay, map, catchError, finalize, take, tap } from 'rxjs/operators';
// NgRx
import { Store, select } from '@ngrx/store';
import { AppState, selectSelectedUserByUrl } from './../../core/@ngrx';
import * as UsersActions from './../../core/@ngrx/users/users.actions';
import * as RouterActions from './../../core/@ngrx/router/router.actions';

// import { UserObservableService } from './../services';
import { UserModel } from './../models/user.model';
import { UsersServicesModule } from '../users-services.module';
import { SpinnerService } from './../../widgets';

@Injectable({
  providedIn: UsersServicesModule
})
export class UserResolveGuard implements Resolve<UserModel> {
  constructor(
    private store: Store<AppState>,
    // private userObservableService: UserObservableService,
    // private router: Router,
    private spinner: SpinnerService
  ) { }

  // resolve(route: ActivatedRouteSnapshot): Observable<UserModel | null> {
  //   console.log('UserResolve Guard is called');

  //   if (!route.paramMap.has('userID')) {
  //     return of(new UserModel(null, '', ''));
  //   }

  //   this.spinner.show();
  //   const id = +route.paramMap.get('userID');

  //   return this.userObservableService.getUser(id).pipe(
  //     delay(2000),
  //     map((user: UserModel) => {
  //       if (user) {
  //         return user;
  //       } else {
  //         this.router.navigate(['/users']);
  //         return null;
  //       }
  //     }),
  //     take(1),
  //     catchError(() => {
  //       this.router.navigate(['/users']);
  //       // catchError MUST return observable
  //       return of(null);
  //     }),
  //     finalize(() => this.spinner.hide())
  //   );
  // }
  resolve(): Observable<UserModel> | null {
    console.log('UserResolve Guard is called');
    this.spinner.show();

    return this.store.pipe(
      select(selectSelectedUserByUrl),
      tap(user => this.store.dispatch(UsersActions.setOriginalUser({ user }))),
      delay(2000),
      map((user: UserModel) => {
        if (user) {
          return user;
        } else {
          // this.router.navigate(['/users']);
          this.store.dispatch(RouterActions.go({
            path: ['/users']
          }));

          return null;
        }
      }),
      take(1),
      catchError(() => {
        // this.router.navigate(['/users']);
        this.store.dispatch(RouterActions.go({
          path: ['/users']
        }));

        // catchError MUST return observable
        return of(null);
      }),
      finalize(() => this.spinner.hide())
    );
  }

}
