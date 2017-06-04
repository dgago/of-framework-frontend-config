var AppState = (function () {
    function AppState() {
    }
    return AppState;
}());


var LanguageSettings = (function () {
    function LanguageSettings() {
        this.localizationPrefix = "localization/";
        this.localizationSuffix = ".json";
        this.storageKey = "language";
        this.lang = undefined;
    }
    return LanguageSettings;
}());

var StateSettings = (function () {
    function StateSettings() {
    }
    return StateSettings;
}());

var UiGroup = (function () {
    function UiGroup() {
    }
    return UiGroup;
}());

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var UiOption = (function (_super) {
    __extends(UiOption, _super);
    function UiOption() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UiOption;
}(AppState));
var MenuOptionType;
(function (MenuOptionType) {
    MenuOptionType[MenuOptionType["Action"] = 1] = "Action";
    MenuOptionType[MenuOptionType["Url"] = 2] = "Url";
    MenuOptionType[MenuOptionType["State"] = 3] = "State";
})(MenuOptionType || (MenuOptionType = {}));

/**
 * Implementación del servicio
 */
var OfConfigService = (function () {
    /**
     * Constructor del servicio
     * @param http Servicio http
     * @param log Servicio de log
     * @param translate Servicio multilenguaje
     * @param settingsEndpoint Endpoint desde donde se cargan las settings de la app
     * @param stateSettings Parámetros de configuración para obtener los estados de la app
     * @param languageSettings Parámetros de configuración de multilenguaje
     */
    function OfConfigService($http, $log, $translate, settingsEndpoint, stateSettings, languageSettings) {
        var _this = this;
        this.$http = $http;
        this.$log = $log;
        this.$translate = $translate;
        this.settingsEndpoint = settingsEndpoint;
        this.stateSettings = stateSettings;
        this.languageSettings = languageSettings;
        /**
         * Settings de la app
         */
        this.settings = {};
        /**
         * Estados de la app
         */
        this.states = [];
        console.debug("logger", $log);
        this.loadSettings()
            .then(function (res) {
            return _this.loadStates();
        })
            .then(function (res) {
            return _this.loadLanguage();
        })
            .catch(function (err) {
            $log.error(err);
        });
    }
    /**
     * Carga la configuración desde el endpoint designado
     */
    OfConfigService.prototype.loadSettings = function () {
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
    /**
     * Inicialización del lenguaje a utilizar en la aplicación
     */
    OfConfigService.prototype.loadLanguage = function () {
        this.$log.debug("of.config - cargando lenguage");
        if (this.languageSettings) {
            this.setLanguage(this.getLanguage());
            this.$log.debug("of.config - lenguaje cargado", this.languageSettings);
        }
        else {
            this.$log.info("of.config - no se especifica configuración para lenguaje");
        }
    };
    /**
     * Carga los estados de la app
     */
    OfConfigService.prototype.loadStates = function () {
        var _this = this;
        console.debug("logger", this.$log);
        this.$log.debug("of.config - cargando estados");
        if (!this.stateSettings) {
            this.$log.info("of.config - no se especifica endpoint para estados");
            return null;
        }
        var pr = this.$http.get(this.stateSettings.statesEndpoint);
        pr.then(function (res) {
            _this.$log.debug("of.config - estados cargados", res.data);
            _this.states = angular.extend(_this.states, res.data);
            if (_this.stateSettings.callback) {
                _this.stateSettings.callback(res.data);
            }
            return res.data;
        });
        return pr;
    };
    /**
     * Devuelve el lenguaje que se está utilizando en la aplicación
     */
    OfConfigService.prototype.getLanguage = function () {
        var lang = this.languageSettings.storage.getItem(this.languageSettings.storageKey) || this.languageSettings.lang;
        return lang;
    };
    /**
     * Establece el lenguaje a utilizar en la aplicación
     * @param lang Lenguaje a establecer
     */
    OfConfigService.prototype.setLanguage = function (lang) {
        this.languageSettings.lang = lang;
        this.languageSettings.storage.setItem(this.languageSettings.storageKey, lang);
        this.$translate.use(lang);
    };
    return OfConfigService;
}());

/**
 * Proveedor del servicio de configuración
 */
var OfConfigServiceProvider = (function () {
    /**
     * Constructor del proveedor
     * @param translateProvider Proveedor de configuración de multilenguaje
     */
    function OfConfigServiceProvider($translateProvider) {
        var _this = this;
        this.$translateProvider = $translateProvider;
        /**
         * Devuelve una instancia del servicio
         */
        this.$get = [
            "$http",
            "$log",
            "$translate",
            function ($http, $log, $translate) {
                console.debug("logger", $log);
                var instance = new OfConfigService($http, $log, $translate, _this.settingsEndpoint, _this.stateSettings, _this.languageSettings);
                return instance;
            }
        ];
    }
    /**
     * Configuración de las settings
     * @param settingsEndpoint Endpoint desde donde se cargan las settings
     */
    OfConfigServiceProvider.prototype.configureSettings = function (settingsEndpoint) {
        console.debug("of.config - configurando settings", settingsEndpoint);
        this.settingsEndpoint = settingsEndpoint;
    };
    /**
     * Configuración de multilenguaje
     * @param languageSettings Parámetros de configuración de multilenguaje
     */
    OfConfigServiceProvider.prototype.configureLanguage = function (languageSettings) {
        console.debug("of.config - configurando lenguaje", languageSettings);
        this.languageSettings = languageSettings;
        this.$translateProvider.useStaticFilesLoader({
            prefix: languageSettings.localizationPrefix,
            suffix: languageSettings.localizationSuffix,
        });
        this.$translateProvider.useSanitizeValueStrategy("escape");
        // Establecimiento del lenguaje por defecto
        if (!languageSettings.lang) {
            languageSettings.lang = (navigator.language || navigator.userLanguage).split("-")[0];
        }
        this.$translateProvider.preferredLanguage(languageSettings.lang);
    };
    /**
     * Configuración de los estados de la app
     * @param stateSettings Parámetros de configuración para obtener los estados de la app
     */
    OfConfigServiceProvider.prototype.configureStates = function (stateSettings) {
        console.debug("of.config - configurando estados", stateSettings);
        this.stateSettings = stateSettings;
    };
    return OfConfigServiceProvider;
}());
/**
 * Inyección de dependencias del proveedor
 */
OfConfigServiceProvider.$inject = ["$translateProvider"];

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
/// <reference types="angular-translate" />
"use strict";
(function (angularJs) {
    console.debug("of.config - inicializando módulo");
    angularJs.module("of.config", [
        "pascalprecht.translate",
    ]);
    /**
     * Services
     */
    angularJs.module("of.config")
        .service("OfHttpService", OfHttpService);
    angularJs.module("of.config")
        .service("OfStorageService", OfLocalStorageService);
    /**
     * Providers
     */
    angularJs.module("of.config")
        .provider("OfConfigService", OfConfigServiceProvider);
})(window.angular);
