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
  public states: Array<UiGroup | UiOption> = [];

  private MODULE: string = "of.config";

  /**
   * Constructor del servicio
   * @param http Servicio http
   * @param log Servicio de log
   * @param translate Servicio multilenguaje
   * @param settingsEndpoint Endpoint desde donde se cargan las settings de la app
   * @param stateSettings Parámetros de configuración para obtener los estados de la app
   * @param languageSettings Parámetros de configuración de multilenguaje
   */
  constructor(
    private $http: ng.IHttpService,
    private $log: ng.ILogService,
    private $translate: ng.translate.ITranslateService,
    private settingsEndpoint: string,
    private stateSettings: StateSettings,
    private languageSettings: LanguageSettings,
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

    if (!this.settingsEndpoint) {
      this.$log.info(this.MODULE + " - no se especifica endpoint para configuración");
      return null;
    }

    const pr = this.$http.get(this.settingsEndpoint);
    pr.then((res: ng.IHttpPromiseCallbackArg<any>) => {
      this.$log.debug(this.MODULE + " - configuración cargada", res.data);

      this.settings = angular.extend(this.settings, res.data);

      return res.data;
    });

    return pr;
  }

  /**
   * Inicialización del lenguaje a utilizar en la aplicación
   */
  public loadLanguage() {
    this.$log.debug(this.MODULE + " - cargando lenguage");

    if (this.languageSettings) {
      this.setLanguage(this.getLanguage());
      this.$log.debug(this.MODULE + " - lenguaje cargado", this.languageSettings);
    } else {
      this.$log.info(this.MODULE + " - no se especifica configuración para lenguaje");
    }
  }

  /**
   * Carga los estados de la app
   */
  public loadStates(): ng.IHttpPromise<Array<UiGroup | UiOption>> {
    this.$log.debug(this.MODULE + " - cargando estados");

    if (!this.stateSettings) {
      this.$log.info(this.MODULE + " - no se especifica endpoint para estados");
      return null;
    }

    const pr = this.$http.get(this.stateSettings.statesEndpoint);
    pr.then((res: ng.IHttpPromiseCallbackArg<Array<UiGroup | UiOption>>) => {
      this.$log.debug(this.MODULE + " - estados cargados", res.data);

      this.states = angular.extend(this.states, res.data);

      if (this.stateSettings.callback) {
        this.stateSettings.callback(res.data);
      }

      return res.data;
    });

    return pr;
  }

  /**
   * Devuelve el lenguaje que se está utilizando en la aplicación
   */
  public getLanguage(): string {
    const lang = this.languageSettings.storage.getItem(this.languageSettings.storageKey) || this.languageSettings.lang;
    return lang;
  }

  /**
   * Establece el lenguaje a utilizar en la aplicación
   * @param lang Lenguaje a establecer
   */
  public setLanguage(lang: string) {
    this.languageSettings.lang = lang;
    this.languageSettings.storage.setItem(this.languageSettings.storageKey, lang);
    this.$translate.use(lang);
  }

}
