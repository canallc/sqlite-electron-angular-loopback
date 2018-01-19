import {Headers, Http, RequestOptionsArgs, Response, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import {ILoopbackFilter} from '../interfaces/loopback-filter';

@Injectable()
export class HttpHelperService {

  constructor(
    private _http: Http
  ) {}

  /**
   * Helper to call Http#get
   */
  public get<T>(url: string, filter?: ILoopbackFilter): Promise<T> {
    return new Promise((resolve, reject) => {
      this._http.get(url, this.getJsonRequestOptions(filter ? {filter: filter} : undefined))
        .map((res: Response) => res.json())
        .subscribe((result: any) => {
          resolve(result);
        }, (err) => {
          reject(err);
        });
    });
  }

  public getCount(url: string, where?: any): Promise<number> {
    return new Promise((resolve, reject) => {
      this._http.get(url, this.getJsonRequestOptions(where ? {where: where} : undefined))
        .map((res: Response) => res.json())
        .subscribe((result: any) => {
          resolve(result.count);
        }, (err) => {
          reject(err);
        });
    });
  }

  public save<T>(url: string, data: any): Promise<T> {
    return this.put(url, data);
  }

  /**
   * Returns true if successful
   */
  public delete(url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.delete(url, this.getJsonRequestOptions()).subscribe((result: any) => {
        resolve(result.statusText === 'Ok' || result.statusText === 'OK');
      }, (err) => {
        console.log('Could not delete the record', err);
        resolve(false);
      });
    });
  }

  private put(url: string, data: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http.put(url, JSON.stringify(data), this.getJsonRequestOptions())
        .map((res: Response) => res.json())
        .subscribe((result: any) => {
          resolve(result);
        }, (response: any) => {
          let body: any = JSON.parse(response._body);
          reject(body.error);
        });
    });
  }

  /**
   * Returns a RequestOptionsArgs object. Takes a ILoopbackFilter. For more information
   * on the loopback filter data: https://docs.strongloop.com/display/public/LB/Querying+data
   */
  private getJsonRequestOptions(params?: {}): RequestOptionsArgs {
    let headers: Headers = new Headers();

    headers.append('Content-Type', 'application/json');

    let requestOptionsArgs: RequestOptionsArgs = {headers: headers};

    if (params) {
      let urlSearchParams: URLSearchParams = new URLSearchParams();
      Object.keys(params).forEach((paramKey: string) => {
        urlSearchParams.set(paramKey, JSON.stringify(params[paramKey]));
      });
      requestOptionsArgs.search = urlSearchParams;
    }

    return requestOptionsArgs;
  }
}
