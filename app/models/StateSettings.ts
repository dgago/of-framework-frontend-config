type StateSettingsCallback = (states: Array<UiOption | UiGroup>) => void;

class StateSettings {

  public statesEndpoint: string;
  public observers: StateSettingsCallback[];

}
