import { Component } from '@angular/core';
import { ITodo } from '../interfaces/todo';
import { TodoService } from '../services/todo-service';

@Component({
  selector: 'todo',
  styles: [`
    .todo-table {
      margin-top: 10px;
      font-size: 16px;
    }
    .todo-table tbody tr:first-child td {
      border-top: none;
    }
    .todo-complete {
      text-decoration: line-through;
    }
    .vertical-align-middle {
      vertical-align: middle !important;
    }
  `],
  template: `
    <div class="page-header">
      <h1>To-Do's</h1>
    </div>
    <input type="text" placeholder="What needs done?" [(ngModel)]="newTodoText" (blur)="newTodoOnBlur()" (keyup.enter)="newTodoOnBlur()" class="input-lg form-control" />
    <table class="table todo-table">
      <tbody>
        <tr *ngFor="let todo of todos">
          <td class="vertical-align-middle" [ngClass]="{'todo-complete': todo.isComplete}">{{todo.description}}</td>
          <td class="text-right vertical-align-middle">
            <a class="btn btn-primary" [ngClass]="{'active': todo.isComplete}" (click)="toggleComplete(todo)"><i class="fa fa-check"></i></a>
            <a class="btn btn-danger" (click)="delete(todo)"><i class="fa fa-times-circle"></i></a>
          </td>
        </tr>
      </tbody>
    </table>

  `,
})
export class TodoComponent  {
  public newTodoText: string = '';
  public todos: ITodo[] = [];

  constructor(private _todoService: TodoService) {}

  public ngOnInit() {
    this._todoService.get().then(todos => this.todos = todos);
  }

  public newTodoOnBlur() {
    // Was text entered?
    if (this.newTodoText) {
      // Initialize new Todo
      let todo: ITodo = { id: undefined, description: this.newTodoText, isComplete: false };

      // Add it to the list so the list updates immediately
      this.todos.push(todo);

      this._todoService.save(todo).then(updatedTodo => {
        // Update the id of the new todo
        todo.id = updatedTodo.id;
      });

      // Reset the text to empty string
      this.newTodoText = '';
    }
  }

  public toggleComplete(todo: ITodo) {
    // Toggle the complete flag
    todo.isComplete = !todo.isComplete;

    // Save the changes
    this._todoService.save(todo);
  }

  public delete(todo: ITodo) {
    // Remove todo from the list
    this.todos.splice(this.todos.indexOf(todo), 1);

    // Save the changes
    this._todoService.delete(todo.id);
  }

}
