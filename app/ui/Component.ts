class Component implements ng.IComponentOptions {
  public bindings: { [boundProperty: string]: string } = {};
  public templateUrl: string | ng.Injectable<(...args: any[]) => string>;
  public transclude: boolean | { [slot: string]: string } = false;
  public controller: string | ng.Injectable<ng.IControllerConstructor>;
}

class ComponentController implements ng.IController {
  protected ui: any = {};
}
