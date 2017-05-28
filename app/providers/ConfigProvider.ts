/**
 * Interface del servicio.
 */
interface IOfConfigService {

  settings: any;

  load(): ng.IHttpPromise<any>;

}

/**
 * Implementación del servicio.
 */
class OfConfigService implements IOfConfigService {

  public settings: any = {};

  constructor(
    private settingsEndpoint: string,
    private $http: ng.IHttpService,
    private $log: ng.ILogService,
  ) {
    this.load();
  }

  public load(): ng.IHttpPromise<any> {
    this.$log.debug("of.config - cargando configuración");

    if (!this.settingsEndpoint) {
      this.$log.info("of.config - no se especifica endpoint para configuración");
      return null;
    }

    const pr = this.$http.get(this.settingsEndpoint);
    pr.then((res: ng.IHttpPromiseCallbackArg<any>) => {
      this.$log.debug("of.config - configuración cargada", res.data);

      this.settings = angular.extend(this.settings, res.data);

      return res.data;
    });

    return pr;
  }

}

/**
 * Proveedor del servicio.
 */
class OfConfigServiceProvider implements ng.IServiceProvider {

  // Devuelve una instancia del servicio.
  public $get = [
    "$http",
    "$log",
    (
      $http: ng.IHttpService,
      $log: ng.ILogService,
    ): IOfConfigService => {
      const instance = new OfConfigService(this.settingsEndpoint, $http, $log);
      return instance;
    }];

  private settingsEndpoint: string;

  // Configuración del servicio.
  public configure(settingsEndpoint: string) {
    console.debug("of.config - configurando proveedor");
    this.settingsEndpoint = settingsEndpoint;
  }

}
