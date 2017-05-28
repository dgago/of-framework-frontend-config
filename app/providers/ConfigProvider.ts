/**
 * Interface del servicio
 */
interface IOfConfigService {

  settings: any;

  loadSettings(): ng.IHttpPromise<any>;

  loadLanguage();

  getLanguage(): string;

  setLanguage(lang: string);

}

/**
 * Implementación del servicio
 */
class OfConfigService implements IOfConfigService {

  public settings: any = {};

  constructor(
    private $http: ng.IHttpService,
    private $log: ng.ILogService,
    private $translate: ng.translate.ITranslateService,
    private settingsEndpoint: string,
    private language: LanguageSettings,
  ) {
    this.loadSettings();
    this.loadLanguage();
  }

  /**
   * Carga la configuración desde el endpoint designado
   */
  public loadSettings(): ng.IHttpPromise<any> {
    this.$log.debug("of.config - cargando configuración");

    if (!this.settingsEndpoint) {
      this.$log.info("of.config - no se especifica endpoint para configuración");
      return null;
    }

    const pr = this.$http.get(this.settingsEndpoint);
    pr.then((res: ng.IHttpPromiseCallbackArg<any>) => {
      this.$log.debug("of.config - configuración cargada", res.data);

      this.settings = angular.extend(this.settings, res.data);

      return res.data;
    });

    return pr;
  }

  /**
   * Inicialización del lenguaje a utilizar en la aplicación
   */
  public loadLanguage() {
    this.$log.debug("of.config - cargando lenguage");

    if (this.language) {
      this.setLanguage(this.getLanguage());
      this.$log.debug("of.config - lenguaje cargado", this.language);
    } else {
      this.$log.info("of.config - no se especifica configuración para lenguaje");
    }
  }

  /**
   * Devuelve el lenguaje que se está utilizando en la aplicación
   */
  public getLanguage(): string {
    const lang = this.language.storage.getItem(this.language.storageKey) || this.language.lang;
    return lang;
  }

  /**
   * Establece el lenguaje a utilizar en la aplicación
   * @param lang Lenguaje a establecer
   */
  public setLanguage(lang: string) {
    this.language.lang = lang;
    this.language.storage.setItem(this.language.storageKey, lang);
    this.$translate.use(lang);
  }

}

/**
 * Proveedor del servicio
 */
class OfConfigServiceProvider implements ng.IServiceProvider {

  public static $inject: ReadonlyArray<string> = ["$translateProvider"];

  // Devuelve una instancia del servicio
  public $get = [
    "$http",
    "$log",
    "$translate",
    (
      $http: ng.IHttpService,
      $log: ng.ILogService,
      $translate: ng.translate.ITranslateService,
    ): IOfConfigService => {
      const instance = new OfConfigService($http, $log, $translate, this.settingsEndpoint, this.languageSettings);
      return instance;
    }];

  private settingsEndpoint: string;

  private languageSettings: LanguageSettings;

  constructor(
    private $translateProvider: ng.translate.ITranslateProvider,
  ) {
  }

  // Configuración del servicio
  public configureSettings(settingsEndpoint: string) {
    console.debug("of.config - configurando settings", settingsEndpoint);
    this.settingsEndpoint = settingsEndpoint;
  }

  public configureLanguage(languageSettings: LanguageSettings) {
    console.debug("of.config - configurando lenguaje", languageSettings);
    this.languageSettings = languageSettings;

    this.$translateProvider.useStaticFilesLoader({
      prefix: languageSettings.localizationPrefix,
      suffix: languageSettings.localizationSuffix,
    });
    this.$translateProvider.useSanitizeValueStrategy("escape");

    // Establecimiento del lenguaje por defecto
    if (!languageSettings.lang) {
      languageSettings.lang = (navigator.language || (navigator as any).userLanguage).split("-")[0];
    }
    this.$translateProvider.preferredLanguage(languageSettings.lang);
  }

}
