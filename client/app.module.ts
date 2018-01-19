import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import 'rxjs/add/operator/map';  // Needed here to avoid this error: Property 'map' does not exist on type 'Observable<Response>'

import { AppComponent }  from './components/app.component';
import { TodoComponent } from './components/todo.component';
import { TodoService } from './services/todo-service';
import { HttpHelperService } from './services/http-helper-service';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    TodoComponent
  ],
  providers: [
    HttpHelperService,
    TodoService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
