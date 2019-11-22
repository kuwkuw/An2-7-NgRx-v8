import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';

// @ngrx
import { Store, select } from '@ngrx/store';
import {
  AppState,
  selectQueryParams,
  selectRouteParams,
  selectRouteData,
  selectUrl
} from './core/@ngrx';
import * as RouterActions from './core/@ngrx/router/router.actions';

// rxjs
import { Subscription, merge } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { MessagesService, CustomPreloadingStrategyService } from './core';
import { SpinnerService } from './widgets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(
    public messagesService: MessagesService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    public spinnerService: SpinnerService,
    private preloadingStrategy: CustomPreloadingStrategyService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // console.log(
    //   `Preloading Modules: `,
    //   this.preloadingStrategy.preloadedModules
    // );
    // this.setPageTitles();

    // Router Selectors Demo
    const url$ = this.store.pipe(select(selectUrl));
    const queryParams$ = this.store.pipe(select(selectQueryParams));
    const routeParams$ = this.store.pipe(select(selectRouteParams));
    const routeData$ = this.store.pipe(select(selectRouteData));
    const source$ = merge(url$, queryParams$, routeParams$, routeData$);
    source$.pipe(tap(val => console.log(val))).subscribe();

  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  onDisplayMessages(): void {
    // this.router.navigate([{ outlets: { messages: ['messages'] } }]);
    this.store.dispatch(RouterActions.go({
      path: [{ outlets: { messages: ['messages'] } }]
    }));

    this.messagesService.isDisplayed = true;
  }

  /**
   * @param $event - component instance
   */
  onActivate($event: any, routerOutlet: RouterOutlet) {
    // console.log('Activated Component', $event, routerOutlet);
    // another way to set titles
    this.titleService.setTitle(routerOutlet.activatedRouteData.title);
    this.metaService.addTags(routerOutlet.activatedRouteData.meta);
  }

  onDeactivate($event: any, routerOutlet: RouterOutlet) {
    // console.log('Deactivated Component', $event, routerOutlet);
  }

  private setPageTitlesAndMeta() {
    this.sub = this.router.events
      .pipe(
        // NavigationStart, NavigationEnd, NavigationCancel,
        // NavigationError, RoutesRecognized, ...
        filter(event => event instanceof NavigationEnd),

        // access to router state, we swap what we’re observing
        // better alternative to accessing the routerState.root directly,
        // is to inject the ActivatedRoute
        // .map(() => this.activatedRoute)
        map(() => this.router.routerState.root),

        // we’ll create a while loop to traverse over the state tree
        // to find the last activated route,
        // and then return it to the stream
        // Doing this allows us to essentially dive into the children
        // property of the routes config
        // to fetch the corresponding page title(s)
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        switchMap(route => route.data)
      )
      .subscribe(data => this.titleService.setTitle(data.title));
  }
}
