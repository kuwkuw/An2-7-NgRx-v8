import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// @NgRx
import { StoreModule } from '@ngrx/store';
import { tasksReducer } from './tasks.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TasksEffects } from './tasks.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('tasks', tasksReducer),
    EffectsModule.forFeature([TasksEffects])
  ]
})
export class TasksStoreModule { }
