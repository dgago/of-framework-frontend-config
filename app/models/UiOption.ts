type UiOptionAction = (ev: ng.IAngularEvent, state: AppState) => void;

class UiOption extends AppState {

  public type: MenuOptionType;

  public icon: string;
  public label: string;
  public tooltip: string;

  public cssClass: string;

  public action: string | UiOptionAction;
  public auth: any;

}

enum MenuOptionType {
  Action = 1,
  Url = 2,
  State = 3,
}
