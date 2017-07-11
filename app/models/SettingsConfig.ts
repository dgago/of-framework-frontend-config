type SettingsEndpointCallback = (settings: any) => void;

class SettingsConfig {

  public endpoint: string;
  public observers: SettingsEndpointCallback[];

}
