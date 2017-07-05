/// <reference types="angular" />
/// <reference types="angular-translate" />
/// <reference types="angular-ui-router" />

"use strict";

((angularJs: ng.IAngularStatic) => {

  const MODULE: string = "of.config";

  angularJs.module(MODULE, [
    "pascalprecht.translate",
    "ui.router",
  ]);

  /**
   * Etapa de configuración.
   */
  angularJs.module(MODULE)
    .config([
      "$urlRouterProvider",
      "OfConfigServiceProvider",
      configure,
    ]);

  /**
   * Etapa de ejecución.
   */
  angularJs.module(MODULE)
    .run([
      "$log",
      "$urlRouter",
      "$uiRouter",
      "OfConfigService",
      run,
    ]);

  /**
   * Services
   */
  angularJs.module(MODULE)
    .service("OfHttpService", OfHttpService);

  angularJs.module(MODULE)
    .service("OfStorageService", OfLocalStorageService);

  /**
   * Providers
   */
  angularJs.module(MODULE)
    .provider("OfConfigService", OfConfigServiceProvider);

  /////////////////////////////////////////////////////////////////////////////

  let statesObserver: StatesEndpointCallback;

  function configure(
    urlRouterProvider: ng.ui.IUrlRouterProvider,
    configServiceProvider: OfConfigServiceProvider,
  ) {
    // Ruteo de vistas
    urlRouterProvider.deferIntercept();
    urlRouterProvider.otherwise("/home");

    // Observer para la carga de estados
    configServiceProvider.statesObservers.push((states: ng.ui.IState[]) => {
      if (statesObserver) {
        statesObserver(states);
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  function run(
    logService: ng.ILogService,
    urlRouterService: ng.ui.IUrlRouterService,
    uiRouterService: any,
    configService: IOfConfigService,
  ) {
    statesObserver = loadStates;

    function loadStates(states: ng.ui.IState[]) {
      // Los estados funcionan como opciones de menú.
      // configService.settings.options = states;

      // Se definen estados del router a partir de los leídos desde el endpoint.
      states.forEach((item: ng.ui.IState) => {
        try {
          uiRouterService.stateRegistry.register(item);
        } catch (e) {
          logService.error(MODULE + " - error registrando estado", item);
          throw e;
        }
      });

      // Configura el UrlRouter para escuchar.
      urlRouterService.sync();
      urlRouterService.listen();
    }
  }

})((window as any).angular);
