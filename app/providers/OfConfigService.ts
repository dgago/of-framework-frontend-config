/**
 * Interface del servicio
 */
interface IOfConfigService {

  settings: any;

  states: ng.ui.IState[];

  loadSettings(): ng.IHttpPromise<any>;

  loadLanguage(): void;

  loadStates(): ng.IHttpPromise<any>;

  getLanguage(): string;

  setLanguage(lang: string);

}

/**
 * Implementación del servicio
 */
class OfConfigService implements IOfConfigService {

  /**
   * Settings de la app
   */
  public settings: any = {};

  /**
   * Estados de la app
   */
  public states: ng.ui.IState[] = [];

  private MODULE: string = "of.config";

  /**
   * Constructor del servicio
   * @param http Servicio http
   * @param log Servicio de log
   * @param translate Servicio multilenguaje
   * @param settingsConfig Configuración para obtener las settings de la app
   * @param statesConfig Configuración para obtener los estados de la app
   * @param languageConfig Parámetros de configuración de multilenguaje
   */
  constructor(
    private $http: ng.IHttpService,
    private $log: ng.ILogService,
    private $translate: ng.translate.ITranslateService,
    private settingsConfig: SettingsConfig,
    private statesConfig: StatesConfig,
    private languageConfig: LanguageConfig,
  ) {
    this.loadSettings()
      .then((res: any) => {
        return this.loadStates();
      })
      .then((res) => {
        return this.loadLanguage();
      })
      .catch((err) => {
        $log.error(err);
      });
  }

  /**
   * Carga la configuración desde el endpoint designado
   */
  public loadSettings(): ng.IHttpPromise<any> {
    this.$log.debug(this.MODULE + " - cargando configuración");

    if (!this.settingsConfig || !this.settingsConfig.endpoint) {
      this.$log.info(this.MODULE + " - no se especifica endpoint para configuración");
      return null;
    }

    const pr = this.$http.get(this.settingsConfig.endpoint);
    pr.then((res: ng.IHttpPromiseCallbackArg<any>) => {
      this.$log.debug(this.MODULE + " - configuración cargada", res.data);

      this.settings = angular.extend(this.settings, res.data);

      if (this.settingsConfig.observers) {
        this.settingsConfig.observers.forEach((callback: SettingsEndpointCallback) => {
          try {
            callback(res.data);
          } catch (e) {
            this.$log.error(e);
          }
        });
      }

      return res.data;
    });

    return pr;
  }

  /**
   * Inicialización del lenguaje a utilizar en la aplicación
   */
  public loadLanguage() {
    this.$log.debug(this.MODULE + " - cargando lenguage");

    if (this.languageConfig) {
      this.setLanguage(this.getLanguage());
      this.$log.debug(this.MODULE + " - lenguaje cargado", this.languageConfig);
    } else {
      this.$log.info(this.MODULE + " - no se especifica configuración para lenguaje");
    }
  }

  /**
   * Carga los estados de la app
   */
  public loadStates(): ng.IHttpPromise<ng.ui.IState[]> {
    this.$log.debug(this.MODULE + " - cargando estados");

    if (!this.statesConfig || !this.statesConfig.endpoint) {
      this.$log.info(this.MODULE + " - no se especifica endpoint para estados");
      return null;
    }

    const pr = this.$http.get(this.statesConfig.endpoint);
    pr.then((res: ng.IHttpPromiseCallbackArg<ng.ui.IState[]>) => {
      this.$log.debug(this.MODULE + " - estados cargados", res.data);

      this.states = angular.extend(this.states, res.data);

      if (this.statesConfig.observers) {
        this.statesConfig.observers.forEach((callback: StatesEndpointCallback) => {
          try {
            callback(res.data);
          } catch (e) {
            this.$log.error(e);
          }
        });
      }

      return res.data;
    });

    return pr;
  }

  /**
   * Devuelve el lenguaje que se está utilizando en la aplicación
   */
  public getLanguage(): string {
    const lang = this.languageConfig.storage.getItem(this.languageConfig.storageKey) || this.languageConfig.lang;
    return lang;
  }

  /**
   * Establece el lenguaje a utilizar en la aplicación
   * @param lang Lenguaje a establecer
   */
  public setLanguage(lang: string) {
    this.languageConfig.lang = lang;
    this.languageConfig.storage.setItem(this.languageConfig.storageKey, lang);
    this.$translate.use(lang);
  }

}
