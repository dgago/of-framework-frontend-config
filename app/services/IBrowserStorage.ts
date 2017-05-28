interface IBrowserStorage {

  setItem(key: string, item: any): void;

  getItem(key: string): any;

  removeItem(key: string): void;

}
