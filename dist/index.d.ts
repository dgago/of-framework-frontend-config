interface IKeyValue {
    id: string;
    value: any;
}

/// <reference types="angular" />
/// <reference types="angular-translate" />
/**
 * Interface del servicio
 */
interface IOfConfigService {
    settings: any;
    loadSettings(): ng.IHttpPromise<any>;
    loadLanguage(): any;
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
    private language;
    settings: any;
    constructor($http: ng.IHttpService, $log: ng.ILogService, $translate: ng.translate.ITranslateService, settingsEndpoint: string, language: LanguageSettings);
    /**
     * Carga la configuración desde el endpoint designado
     */
    loadSettings(): ng.IHttpPromise<any>;
    /**
     * Inicialización del lenguaje a utilizar en la aplicación
     */
    loadLanguage(): void;
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
/**
 * Proveedor del servicio
 */
declare class OfConfigServiceProvider implements ng.IServiceProvider {
    private $translateProvider;
    static $inject: ReadonlyArray<string>;
    $get: (string | (($http: angular.IHttpService, $log: angular.ILogService, $translate: angular.translate.ITranslateService) => IOfConfigService))[];
    private settingsEndpoint;
    private languageSettings;
    constructor($translateProvider: ng.translate.ITranslateProvider);
    configureSettings(settingsEndpoint: string): void;
    configureLanguage(languageSettings: LanguageSettings): void;
}

declare class LanguageSettings {
    localizationPrefix: string;
    localizationSuffix: string;
    storageKey: string;
    storage: IBrowserStorage;
    lang: string;
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

