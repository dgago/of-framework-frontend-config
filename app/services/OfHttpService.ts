/**
 * Servicio base para acceso HTTP.
 */
class OfHttpService<T> {
  /**
   * Inyección de las dependencias por nombre real declarado en angular.
   */
  public static $inject: ReadonlyArray<string> = ["$http", "$httpParamSerializer", "$log", "Settings"];

  protected baseUri: string;
  protected resourcePath: string;

  /**
   * Las dependencias se inyectan en el constructor. A cada una se le
   * da un nombre.
   * @param Http Servicio Http de AngularJs.
   * @param HttpParamSerializer Servicio de serialización de parámetros Http.
   * @param Log Servicio de log.
   * @param Settings Variables de configuración de la aplicación.
   */
  constructor(
    protected $http: ng.IHttpService,
    protected $httpParamSerializer: ng.IHttpParamSerializer,
    protected $log: ng.ILogService,
  ) { }

  public findAll(): ng.IHttpPromise<T[]> {
    return this.$http.get(this.baseUri + this.resourcePath);
  }

  public create(item: T): ng.IHttpPromise<T> {
    return this.$http.post(this.baseUri + this.resourcePath, item);
  }

  public findOne(id: string): ng.IHttpPromise<T> {
    return this.$http.get(this.baseUri + this.resourcePath + id);
  }

  public update(id: string, item: T): ng.IHttpPromise<T> {
    return this.$http.put(this.baseUri + this.resourcePath + id, item);
  }

  public delete(id: string): ng.IHttpPromise<T> {
    return this.$http.delete(this.baseUri + this.resourcePath + id);
  }

  /**
   * Transforma un Array de objetos con campos id y value a un único
   * objeto que tiene atributos con el nombre del campo id en lowercase
   * y el valor de cada atributo es el campo value.
   * @param data Array de objetos con campos id y value.
   */
  public toObject(data: IKeyValue[]): object {
    const res: any = {};
    data.forEach((element) => {
      res[element.id.toLowerCase()] = element.value;
    });
    return res;
  }
}
