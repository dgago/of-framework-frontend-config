type SettingsEndpointCallback = (settings: any) => void;
type StatesEndpointCallback = (states: ng.ui.IState[]) => void;

class StatesConfig {

  public endpoint: string;
  public observers: StatesEndpointCallback[];

}

class SettingsConfig {

  public endpoint: string;
  public observers: SettingsEndpointCallback[];

}
