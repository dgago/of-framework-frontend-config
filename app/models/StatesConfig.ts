type StatesEndpointCallback = (states: ng.ui.IState[]) => void;

class StatesConfig {

  public endpoint: string;
  public observers: StatesEndpointCallback[];

}
