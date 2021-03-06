
var LanguageConfig = (function () {
    function LanguageConfig() {
        this.localizationPrefix = "localization/";
        this.localizationSuffix = ".json";
        this.storageKey = "language";
        this.lang = undefined;
    }
    return LanguageConfig;
}());

var SettingsConfig = (function () {
    function SettingsConfig() {
    }
    return SettingsConfig;
}());

var StatesConfig = (function () {
    function StatesConfig() {
    }
    return StatesConfig;
}());

var UiOption = (function () {
    function UiOption() {
    }
    return UiOption;
}());
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
     * @param settingsConfig Configuración para obtener las settings de la app
     * @param statesConfig Configuración para obtener los estados de la app
     * @param languageConfig Parámetros de configuración de multilenguaje
     */
    function OfConfigService($http, $log, $translate, settingsConfig, statesConfig, languageConfig) {
        var _this = this;
        this.$http = $http;
        this.$log = $log;
        this.$translate = $translate;
        this.settingsConfig = settingsConfig;
        this.statesConfig = statesConfig;
        this.languageConfig = languageConfig;
        /**
         * Settings de la app
         */
        this.settings = {};
        /**
         * Estados de la app
         */
        this.states = [];
        this.MODULE = "of.config";
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
        this.$log.debug(this.MODULE + " - cargando configuración");
        if (!this.settingsConfig || !this.settingsConfig.endpoint) {
            this.$log.info(this.MODULE + " - no se especifica endpoint para configuración");
            return null;
        }
        var pr = this.$http.get(this.settingsConfig.endpoint);
        pr.then(function (res) {
            _this.$log.debug(_this.MODULE + " - configuración cargada", res.data);
            _this.settings = angular.extend(_this.settings, res.data);
            if (_this.settingsConfig.observers) {
                _this.settingsConfig.observers.forEach(function (callback) {
                    try {
                        callback(res.data);
                    }
                    catch (e) {
                        _this.$log.error(e);
                    }
                });
            }
            return res.data;
        });
        return pr;
    };
    /**
     * Inicialización del lenguaje a utilizar en la aplicación
     */
    OfConfigService.prototype.loadLanguage = function () {
        this.$log.debug(this.MODULE + " - cargando lenguage");
        if (this.languageConfig) {
            this.setLanguage(this.getLanguage());
            this.$log.debug(this.MODULE + " - lenguaje cargado", this.languageConfig);
        }
        else {
            this.$log.info(this.MODULE + " - no se especifica configuración para lenguaje");
        }
    };
    /**
     * Carga los estados de la app
     */
    OfConfigService.prototype.loadStates = function () {
        var _this = this;
        this.$log.debug(this.MODULE + " - cargando estados");
        if (!this.statesConfig || !this.statesConfig.endpoint) {
            this.$log.info(this.MODULE + " - no se especifica endpoint para estados");
            return null;
        }
        var pr = this.$http.get(this.statesConfig.endpoint);
        pr.then(function (res) {
            _this.$log.debug(_this.MODULE + " - estados cargados", res.data);
            _this.states = angular.extend(_this.states, res.data);
            if (_this.statesConfig.observers) {
                _this.statesConfig.observers.forEach(function (callback) {
                    try {
                        callback(res.data);
                    }
                    catch (e) {
                        _this.$log.error(e);
                    }
                });
            }
            return res.data;
        });
        return pr;
    };
    /**
     * Devuelve el lenguaje que se está utilizando en la aplicación
     */
    OfConfigService.prototype.getLanguage = function () {
        var lang = this.languageConfig.storage.getItem(this.languageConfig.storageKey) || this.languageConfig.lang;
        return lang;
    };
    /**
     * Establece el lenguaje a utilizar en la aplicación
     * @param lang Lenguaje a establecer
     */
    OfConfigService.prototype.setLanguage = function (lang) {
        this.languageConfig.lang = lang;
        this.languageConfig.storage.setItem(this.languageConfig.storageKey, lang);
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
                var settingsConfig = new SettingsConfig();
                settingsConfig.endpoint = _this.settingsEndpoint;
                settingsConfig.observers = _this.settingsObservers;
                var statesConfig = new StatesConfig();
                statesConfig.endpoint = _this.statesEndpoint;
                statesConfig.observers = _this.statesObservers;
                var instance = new OfConfigService($http, $log, $translate, settingsConfig, statesConfig, _this.languageConfig);
                return instance;
            }
        ];
        /**
         * Observers para settings
         */
        this.settingsObservers = [];
        /**
         * Observers para states
         */
        this.statesObservers = [];
        /**
         * Nombre del módulo
         */
        this.MODULE = "of.config";
    }
    /**
     * Configuración de las settings
     * @param settingsEndpoint Endpoint desde donde se cargan las settings
     */
    OfConfigServiceProvider.prototype.configureSettings = function (settingsEndpoint) {
        console.debug(this.MODULE + " - configurando settings", settingsEndpoint);
        this.settingsEndpoint = settingsEndpoint;
    };
    /**
     * Configuración de los estados de la app
     * @param statesEndpoint Endpoint desde donde se cargan los estados de la app
     */
    OfConfigServiceProvider.prototype.configureStates = function (statesEndpoint) {
        console.debug(this.MODULE + " - configurando estados", statesEndpoint);
        this.statesEndpoint = statesEndpoint;
    };
    /**
     * Configuración de multilenguaje
     * @param languageConfig Parámetros de configuración de multilenguaje
     */
    OfConfigServiceProvider.prototype.configureLanguage = function (languageConfig) {
        console.debug(this.MODULE + " - configurando lenguaje", languageConfig);
        this.languageConfig = languageConfig;
        this.$translateProvider.useStaticFilesLoader({
            prefix: languageConfig.localizationPrefix,
            suffix: languageConfig.localizationSuffix,
        });
        this.$translateProvider.useSanitizeValueStrategy("escape");
        // Establecimiento del lenguaje por defecto
        if (!languageConfig.lang) {
            languageConfig.lang = (navigator.language || navigator.userLanguage).split("-")[0];
        }
        this.$translateProvider.preferredLanguage(languageConfig.lang);
    };
    /**
     * Inyección de dependencias del proveedor
     */
    OfConfigServiceProvider.$inject = ["$translateProvider"];
    return OfConfigServiceProvider;
}());


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
    OfHttpService.prototype.delete = function (id) {
        return this.$http.delete(this.baseUri + this.resourcePath + id);
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
    /**
     * Inyección de las dependencias por nombre real declarado en angular.
     */
    OfHttpService.$inject = ["$http", "$httpParamSerializer", "$log", "Settings"];
    return OfHttpService;
}());

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

var Component = (function () {
    function Component() {
        this.bindings = {};
        this.transclude = false;
    }
    return Component;
}());
var ComponentController = (function () {
    function ComponentController() {
        this.ui = {};
    }
    ComponentController.prototype.$onInit = function () {
        // nothing here
    };
    return ComponentController;
}());

var DefaultController = (function () {
    function DefaultController($scope, $state, $config) {
        this.$scope = $scope;
        this.$state = $state;
        this.$config = $config;
        console.log($state.current);
        console.log($config.settings);
    }
    DefaultController.prototype.$onInit = function () {
        // nothing here
    };
    DefaultController.$inject = ["$scope", "$state", "OfConfigService"];
    return DefaultController;
}());

/// <reference types="angular" />
/// <reference types="angular-translate" />
/// <reference types="angular-ui-router" />
"use strict";
(function (angularJs) {
    var MODULE = "of.config";
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
    var statesObserver;
    function configure(urlRouterProvider, configServiceProvider) {
        // Ruteo de vistas
        urlRouterProvider.deferIntercept();
        urlRouterProvider.otherwise("/home");
        // Observer para la carga de estados
        configServiceProvider.statesObservers.push(function (states) {
            if (statesObserver) {
                statesObserver(states);
            }
        });
    }
    /////////////////////////////////////////////////////////////////////////////
    function run(logService, urlRouterService, uiRouterService, configService) {
        statesObserver = loadStates;
        function loadStates(states) {
            // Los estados funcionan como opciones de menú.
            // configService.settings.options = states;
            // Se definen estados del router a partir de los leídos desde el endpoint.
            states.forEach(function (item) {
                try {
                    uiRouterService.stateRegistry.register(item);
                }
                catch (e) {
                    logService.error(MODULE + " - error registrando estado", item);
                    throw e;
                }
            });
            // Configura el UrlRouter para escuchar.
            urlRouterService.sync();
            urlRouterService.listen();
        }
    }
})(window.angular);
