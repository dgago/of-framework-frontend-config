/**
 * Proveedor del servicio de configuración
 */
class OfConfigServiceProvider implements ng.IServiceProvider {

  /**
   * Inyección de dependencias del proveedor
   */
  public static $inject: ReadonlyArray<string> = ["$translateProvider"];

  /**
   * Devuelve una instancia del servicio
   */
  public $get = [
    "$http",
    "$log",
    "$translate",
    (
      $http: ng.IHttpService,
      $log: ng.ILogService,
      $translate: ng.translate.ITranslateService,
    ): IOfConfigService => {

      const settingsConfig = new SettingsConfig();
      settingsConfig.endpoint = this.settingsEndpoint;
      settingsConfig.observers = this.settingsObservers;

      const statesConfig = new StatesConfig();
      statesConfig.endpoint = this.statesEndpoint;
      statesConfig.observers = this.statesObservers;

      const instance = new OfConfigService($http, $log, $translate,
        settingsConfig, statesConfig, this.languageConfig);
      return instance;
    }];

  /**
   * Observers para settings
   */
  public settingsObservers: SettingsEndpointCallback[] = [];

  /**
   * Observers para states
   */
  public statesObservers: StatesEndpointCallback[] = [];

  /**
   * Nombre del módulo
   */
  private MODULE: string = "of.config";

  /**
   * Endpoint desde donde se cargan las settings
   */
  private settingsEndpoint: string;

  /**
   * Endpoint desde donde se cargan los estados de la app
   */
  private statesEndpoint: string;

  /**
   * Parámetros de configuración de multilenguaje
   */
  private languageConfig: LanguageConfig;

  /**
   * Constructor del proveedor
   * @param translateProvider Proveedor de configuración de multilenguaje
   */
  constructor(
    private $translateProvider: ng.translate.ITranslateProvider,
  ) {
  }

  /**
   * Configuración de las settings
   * @param settingsEndpoint Endpoint desde donde se cargan las settings
   */
  public configureSettings(settingsEndpoint: string) {
    console.debug(this.MODULE + " - configurando settings", settingsEndpoint);
    this.settingsEndpoint = settingsEndpoint;
  }

  /**
   * Configuración de los estados de la app
   * @param statesEndpoint Endpoint desde donde se cargan los estados de la app
   */
  public configureStates(statesEndpoint: string) {
    console.debug(this.MODULE + " - configurando estados", statesEndpoint);
    this.statesEndpoint = statesEndpoint;
  }

  /**
   * Configuración de multilenguaje
   * @param languageConfig Parámetros de configuración de multilenguaje
   */
  public configureLanguage(languageConfig: LanguageConfig) {
    console.debug(this.MODULE + " - configurando lenguaje", languageConfig);
    this.languageConfig = languageConfig;

    this.$translateProvider.useStaticFilesLoader({
      prefix: languageConfig.localizationPrefix,
      suffix: languageConfig.localizationSuffix,
    });
    this.$translateProvider.useSanitizeValueStrategy("escape");

    // Establecimiento del lenguaje por defecto
    if (!languageConfig.lang) {
      languageConfig.lang = (navigator.language || (navigator as any).userLanguage).split("-")[0];
    }
    this.$translateProvider.preferredLanguage(languageConfig.lang);
  }
}
