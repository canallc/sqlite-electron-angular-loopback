import { Injectable } from '@angular/core';
import { ITodo } from '../interfaces/todo';
import {ILoopbackFilter} from '../interfaces/loopback-filter';
import {HttpHelperService} from './http-helper-service';

@Injectable()
export class TodoService {
  public static BASE_ROUTE: string = '/api/todos/';

  constructor(private _httpHelperService: HttpHelperService) {}

  public get(filter?: ILoopbackFilter): Promise<ITodo[]> {
    return this._httpHelperService.get<ITodo[]>(TodoService.BASE_ROUTE, filter);
  }

  public save(todo: ITodo): Promise<ITodo> {
    return this._httpHelperService.save<ITodo>(TodoService.BASE_ROUTE, todo);
  }

  public delete(id: string): Promise<boolean> {
    return this._httpHelperService.delete(TodoService.BASE_ROUTE + id);
  }
}
