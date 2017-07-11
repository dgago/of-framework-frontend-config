class DefaultController implements ng.IController {
  public static $inject: ReadonlyArray<string> = ["$scope", "$state", "OfConfigService"];

  constructor(protected $scope: ng.IScope, protected $state: ng.ui.IStateService, protected $config: IOfConfigService) {
    console.log($state.current);
    console.log($config.settings);
  }

  public $onInit?(): void {
    // nothing here
  }
}
