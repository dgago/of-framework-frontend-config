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
      console.debug("logger", $log);
      const instance = new OfConfigService($http, $log, $translate, this.settingsEndpoint, this.stateSettings, this.languageSettings);
      return instance;
    }];

  /**
   * Parámetros de configuración para obtener los estados de la app
   */
  public stateSettings: StateSettings;

  /**
   * Endpoint desde donde se cargan las settings
   */
  private settingsEndpoint: string;

  /**
   * Parámetros de configuración de multilenguaje
   */
  private languageSettings: LanguageSettings;

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
    console.debug("of.config - configurando settings", settingsEndpoint);
    this.settingsEndpoint = settingsEndpoint;
  }

  /**
   * Configuración de multilenguaje
   * @param languageSettings Parámetros de configuración de multilenguaje
   */
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

  /**
   * Configuración de los estados de la app
   * @param stateSettings Parámetros de configuración para obtener los estados de la app
   */
  public configureStates(stateSettings: StateSettings) {
    console.debug("of.config - configurando estados", stateSettings);
    this.stateSettings = stateSettings;
  }

}
