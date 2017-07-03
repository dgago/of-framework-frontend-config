/// <reference types="angular" />
/// <reference types="angular-translate" />

"use strict";

((angularJs: ng.IAngularStatic) => {

  const MODULE: string = "of.config";

  console.debug("of.config - inicializando módulo");
  angularJs.module(MODULE, [
    "pascalprecht.translate",
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

})((window as any).angular);
