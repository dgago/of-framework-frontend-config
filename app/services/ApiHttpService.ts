/*class OfApiHttpService<T> extends OfHttpService {
  protected baseEndpoint: string;

  public get(args: any, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T[]> {
    return this.Http.get(this.baseEndpoint + "?" + this.HttpParamSerializer(args), config);
  }

  public getOne(id: string, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T> {
    return this.Http.get(this.baseEndpoint + id, config);
  }

  public post(args: T, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T> {
    return this.Http.post(this.baseEndpoint, args, config);
  }

  public put(id: string, args: T, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<{}> {
    return this.Http.put(this.baseEndpoint + id, args, config);
  }

  public delete(id: string, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<{}> {
    return this.Http.delete(this.baseEndpoint + id, config);
  }
}
*/
