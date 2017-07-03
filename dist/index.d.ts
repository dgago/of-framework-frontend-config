/// <reference types="angular" />
declare class AppState {
    abstract: boolean;
    controller: string | ng.IController;
    data: any;
    name: string;
    parent: string;
    templateUrl: string;
    url: string;
}

interface IKeyValue {
    id: string;
    value: any;
}

declare class LanguageSettings {
    localizationPrefix: string;
    localizationSuffix: string;
    storageKey: string;
    storage: IBrowserStorage;
    lang: string;
}

declare type StateSettingsCallback = (states: Array<UiOption | UiGroup>) => void;
declare class StateSettings {
    statesEndpoint: string;
    observers: StateSettingsCallback[];
}

declare class UiGroup {
    icon: string;
    label: string;
    tooltip: string;
    options: UiOption[];
}

/// <reference types="angular" />
declare type UiOptionAction = (ev: ng.IAngularEvent, state: AppState) => void;
declare class UiOption extends AppState {
    type: MenuOptionType;
    icon: string;
    label: string;
    tooltip: string;
    cssClass: string;
    action: string | UiOptionAction;
    auth: any;
}
declare enum MenuOptionType {
    Action = 1,
    Url = 2,
    State = 3,
}

/// <reference types="angular" />
/// <reference types="angular-translate" />
/**
 * Interface del servicio
 */
interface IOfConfigService {
    settings: any;
    states: Array<UiGroup | UiOption>;
    loadSettings(): ng.IHttpPromise<any>;
    loadLanguage(): void;
    loadStates(): ng.IHttpPromise<any>;
    getLanguage(): string;
    setLanguage(lang: string): any;
}
/**
 * Implementación del servicio
 */
declare class OfConfigService implements IOfConfigService {
    private $http;
    private $log;
    private $translate;
    private settingsEndpoint;
    private stateSettings;
    private languageSettings;
    /**
     * Settings de la app
     */
    settings: any;
    /**
     * Estados de la app
     */
    states: Array<UiGroup | UiOption>;
    private MODULE;
    /**
     * Constructor del servicio
     * @param http Servicio http
     * @param log Servicio de log
     * @param translate Servicio multilenguaje
     * @param settingsEndpoint Endpoint desde donde se cargan las settings de la app
     * @param stateSettings Parámetros de configuración para obtener los estados de la app
     * @param languageSettings Parámetros de configuración de multilenguaje
     */
    constructor($http: ng.IHttpService, $log: ng.ILogService, $translate: ng.translate.ITranslateService, settingsEndpoint: string, stateSettings: StateSettings, languageSettings: LanguageSettings);
    /**
     * Carga la configuración desde el endpoint designado
     */
    loadSettings(): ng.IHttpPromise<any>;
    /**
     * Inicialización del lenguaje a utilizar en la aplicación
     */
    loadLanguage(): void;
    /**
     * Carga los estados de la app
     */
    loadStates(): ng.IHttpPromise<Array<UiGroup | UiOption>>;
    /**
     * Devuelve el lenguaje que se está utilizando en la aplicación
     */
    getLanguage(): string;
    /**
     * Establece el lenguaje a utilizar en la aplicación
     * @param lang Lenguaje a establecer
     */
    setLanguage(lang: string): void;
}

/// <reference types="angular" />
/// <reference types="angular-translate" />
/**
 * Proveedor del servicio de configuración
 */
declare class OfConfigServiceProvider implements ng.IServiceProvider {
    private $translateProvider;
    /**
     * Inyección de dependencias del proveedor
     */
    static $inject: ReadonlyArray<string>;
    /**
     * Devuelve una instancia del servicio
     */
    $get: (string | (($http: angular.IHttpService, $log: angular.ILogService, $translate: angular.translate.ITranslateService) => IOfConfigService))[];
    /**
     * Parámetros de configuración para obtener los estados de la app
     */
    stateSettings: StateSettings;
    /**
     * Endpoint desde donde se cargan las settings
     */
    private settingsEndpoint;
    /**
     * Parámetros de configuración de multilenguaje
     */
    private languageSettings;
    /**
     * Constructor del proveedor
     * @param translateProvider Proveedor de configuración de multilenguaje
     */
    constructor($translateProvider: ng.translate.ITranslateProvider);
    /**
     * Configuración de las settings
     * @param settingsEndpoint Endpoint desde donde se cargan las settings
     */
    configureSettings(settingsEndpoint: string): void;
    /**
     * Configuración de multilenguaje
     * @param languageSettings Parámetros de configuración de multilenguaje
     */
    configureLanguage(languageSettings: LanguageSettings): void;
    /**
     * Configuración de los estados de la app
     * @param stateSettings Parámetros de configuración para obtener los estados de la app
     */
    configureStates(stateSettings: StateSettings): void;
}

/// <reference types="angular" />
/**
 * Servicio base para acceso HTTP.
 */
declare class OfHttpService<T> {
    protected $http: ng.IHttpService;
    protected $httpParamSerializer: ng.IHttpParamSerializer;
    protected $log: ng.ILogService;
    /**
     * Inyección de las dependencias por nombre real declarado en angular.
     */
    static $inject: ReadonlyArray<string>;
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
    constructor($http: ng.IHttpService, $httpParamSerializer: ng.IHttpParamSerializer, $log: ng.ILogService);
    findAll(): ng.IHttpPromise<T[]>;
    create(item: T): ng.IHttpPromise<T>;
    findOne(id: string): ng.IHttpPromise<T>;
    update(id: string, item: T): ng.IHttpPromise<T>;
    delete(id: string): ng.IHttpPromise<T>;
    /**
     * Transforma un Array de objetos con campos id y value a un único
     * objeto que tiene atributos con el nombre del campo id en lowercase
     * y el valor de cada atributo es el campo value.
     * @param data Array de objetos con campos id y value.
     */
    toObject(data: IKeyValue[]): object;
}

interface IBrowserStorage {
    setItem(key: string, item: any): void;
    getItem(key: string): any;
    removeItem(key: string): void;
}

/**
 * Clase que abstrae el acceso a localStorage, serializando y
 * deserializando los objetos convenientemente para facilidad
 * de uso.
 */
declare class OfLocalStorageService {
    /**
     * Guarda un elemento serializado en localStorage
     * @param key Clave de localStorage
     * @param item Valor a guardar
     */
    setItem(key: string, item: any): void;
    /**
     * Obtiene un elemento de localStorage
     * @param key Clave de localStorage
     */
    getItem(key: string): any;
    /**
     * Remueve un elemento de localStorage
     * @param key Clave de localStorage
     */
    removeItem(key: string): void;
}

/**
 * Clase que abstrae el acceso a SessionStorage, serializando y
 * deserializando los objetos convenientemente para facilidad
 * de uso.
 */
declare class OfSessionStorageService {
    /**
     * Guarda un elemento serializado en SessionStorage
     * @param key Clave de SessionStorage
     * @param item Valor a guardar
     */
    setItem(key: string, item: any): void;
    /**
     * Obtiene un elemento de SessionStorage
     * @param key Clave de SessionStorage
     */
    getItem(key: string): any;
    /**
     * Remueve un elemento de SessionStorage
     * @param key Clave de SessionStorage
     */
    removeItem(key: string): void;
}

