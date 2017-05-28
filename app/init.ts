/// <reference types="angular" />

"use strict";

((angularJs: ng.IAngularStatic) => {

  console.debug("of.config - inicializando módulo");
  angularJs.module("of.config", []);

  /**
   * Services.
   */
  angularJs.module("of.config")
    .service("OfHttpService", OfHttpService);

  // angularJs.module("of.config")
  //   .service("OfApiHttpService", OfApiHttpService);

  angularJs.module("of.config")
    .service("OfStorageService", OfLocalStorageService);

  /**
   * Providers.
   */
  angularJs.module("of.config")
    .provider("OfConfigService", OfConfigServiceProvider);

})((window as any).angular);
