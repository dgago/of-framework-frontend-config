
/**
 * Implementación del servicio.
 */
var OfConfigService = (function () {
    function OfConfigService(settingsEndpoint, $http, $log) {
        this.settingsEndpoint = settingsEndpoint;
        this.$http = $http;
        this.$log = $log;
        this.settings = {};
        this.load();
    }
    OfConfigService.prototype.load = function () {
        var _this = this;
        this.$log.debug("of.config - cargando configuración");
        if (!this.settingsEndpoint) {
            this.$log.info("of.config - no se especifica endpoint para configuración");
            return null;
        }
        var pr = this.$http.get(this.settingsEndpoint);
        pr.then(function (res) {
            _this.$log.debug("of.config - configuración cargada", res.data);
            _this.settings = angular.extend(_this.settings, res.data);
            return res.data;
        });
        return pr;
    };
    return OfConfigService;
}());
/**
 * Proveedor del servicio.
 */
var OfConfigServiceProvider = (function () {
    function OfConfigServiceProvider() {
        var _this = this;
        // Devuelve una instancia del servicio.
        this.$get = [
            "$http",
            "$log",
            function ($http, $log) {
                var instance = new OfConfigService(_this.settingsEndpoint, $http, $log);
                return instance;
            }
        ];
    }
    // Configuración del servicio.
    OfConfigServiceProvider.prototype.configure = function (settingsEndpoint) {
        console.debug("of.config - configurando proveedor");
        this.settingsEndpoint = settingsEndpoint;
    };
    return OfConfigServiceProvider;
}());

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

/**
 * Servicio base para acceso HTTP.
 */
var OfHttpService = (function () {
    /**
     * Las dependencias se inyectan en el constructor. A cada una se le
     * da un nombre.
     * @param Http Servicio Http de AngularJs.
     * @param HttpParamSerializer Servicio de serialización de parámetros Http.
     * @param Log Servicio de log.
     * @param Settings Variables de configuración de la aplicación.
     */
    function OfHttpService($http, $httpParamSerializer, $log) {
        this.$http = $http;
        this.$httpParamSerializer = $httpParamSerializer;
        this.$log = $log;
    }
    OfHttpService.prototype.findAll = function () {
        return this.$http.get(this.baseUri + this.resourcePath);
    };
    OfHttpService.prototype.create = function (item) {
        return this.$http.post(this.baseUri + this.resourcePath, item);
    };
    OfHttpService.prototype.findOne = function (id) {
        return this.$http.get(this.baseUri + this.resourcePath + id);
    };
    OfHttpService.prototype.update = function (id, item) {
        return this.$http.put(this.baseUri + this.resourcePath + id, item);
    };
    /**
     * Transforma un Array de objetos con campos id y value a un único
     * objeto que tiene atributos con el nombre del campo id en lowercase
     * y el valor de cada atributo es el campo value.
     * @param data Array de objetos con campos id y value.
     */
    OfHttpService.prototype.toObject = function (data) {
        var res = {};
        data.forEach(function (element) {
            res[element.id.toLowerCase()] = element.value;
        });
        return res;
    };
    return OfHttpService;
}());
/**
 * Inyección de las dependencias por nombre real declarado en angular.
 */
OfHttpService.$inject = ["$http", "$httpParamSerializer", "$log", "Settings"];


/**
 * Clase que abstrae el acceso a localStorage, serializando y
 * deserializando los objetos convenientemente para facilidad
 * de uso.
 */
var OfLocalStorageService = (function () {
    function OfLocalStorageService() {
    }
    /**
     * Guarda un elemento serializado en localStorage
     * @param key Clave de localStorage
     * @param item Valor a guardar
     */
    OfLocalStorageService.prototype.setItem = function (key, item) {
        if (item != null) {
            localStorage.setItem(key, JSON.stringify(item));
        }
        else {
            localStorage.removeItem(key);
        }
    };
    /**
     * Obtiene un elemento de localStorage
     * @param key Clave de localStorage
     */
    OfLocalStorageService.prototype.getItem = function (key) {
        var item = localStorage.getItem(key);
        return JSON.parse(item);
    };
    /**
     * Remueve un elemento de localStorage
     * @param key Clave de localStorage
     */
    OfLocalStorageService.prototype.removeItem = function (key) {
        localStorage.removeItem(key);
    };
    return OfLocalStorageService;
}());

/**
 * Clase que abstrae el acceso a SessionStorage, serializando y
 * deserializando los objetos convenientemente para facilidad
 * de uso.
 */
var OfSessionStorageService = (function () {
    function OfSessionStorageService() {
    }
    /**
     * Guarda un elemento serializado en SessionStorage
     * @param key Clave de SessionStorage
     * @param item Valor a guardar
     */
    OfSessionStorageService.prototype.setItem = function (key, item) {
        if (item != null) {
            sessionStorage.setItem(key, JSON.stringify(item));
        }
        else {
            sessionStorage.removeItem(key);
        }
    };
    /**
     * Obtiene un elemento de SessionStorage
     * @param key Clave de SessionStorage
     */
    OfSessionStorageService.prototype.getItem = function (key) {
        var item = sessionStorage.getItem(key);
        return JSON.parse(item);
    };
    /**
     * Remueve un elemento de SessionStorage
     * @param key Clave de SessionStorage
     */
    OfSessionStorageService.prototype.removeItem = function (key) {
        sessionStorage.removeItem(key);
    };
    return OfSessionStorageService;
}());

/// <reference types="angular" />
"use strict";
(function (angularJs) {
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
})(window.angular);
