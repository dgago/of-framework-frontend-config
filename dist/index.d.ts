interface IKeyValue {
    id: string;
    value: any;
}

/// <reference types="angular" />
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
declare class OfConfigService implements IOfConfigService {
    private settingsEndpoint;
    private $http;
    private $log;
    settings: any;
    constructor(settingsEndpoint: string, $http: ng.IHttpService, $log: ng.ILogService);
    load(): ng.IHttpPromise<any>;
}
/**
 * Proveedor del servicio.
 */
declare class OfConfigServiceProvider implements ng.IServiceProvider {
    $get: (string | (($http: angular.IHttpService, $log: angular.ILogService) => IOfConfigService))[];
    private settingsEndpoint;
    configure(settingsEndpoint: string): void;
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

