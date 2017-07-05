class UiOption {

  public type: MenuOptionType;

  public icon: string;
  public label: string;
  public tooltip: string;

  public cssClass: string;

  public action: string | ((ev: ng.IAngularEvent, state: ng.ui.IState) => void);
  public auth: any;

}

enum MenuOptionType {
  Action = 1,
  Url = 2,
  State = 3,
}
