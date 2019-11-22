import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

// @NgRx
import { Store, select } from '@ngrx/store';
import { AppState, selectTasksState, /*selectSelectedTask,*/ selectSelectedTaskByUrl } from './../../../core/@ngrx';
import * as TasksActions from './../../../core/@ngrx/tasks/tasks.actions';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { TaskModel, Task } from './../../models/task.model';

@Component({
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  task: Task;
  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    // private route: ActivatedRoute,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    let observer = {
      // next: tasksState => {
      //   if (tasksState.selectedTask) {
      //     this.task = { ...tasksState.selectedTask } as TaskModel;
      //   } else {
      //     this.task = new TaskModel();
      //   }
      // },
      next: task => {
        if (task) {
          this.task = { ...task } as TaskModel;
        } else {
          this.task = new TaskModel();
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {
        console.log('Stream is completed');
      }
    };

    this.store
      .pipe(
        select(selectSelectedTaskByUrl),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(observer);
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }


  onSaveTask() {
    const task = { ...this.task } as Task;

    if (task.id) {
      this.store.dispatch(TasksActions.updateTask({ task }));
    } else {
      this.store.dispatch(TasksActions.createTask({ task }));
    }
  }

  onGoBack(): void {
    this.router.navigate(['/home']);
  }
}
