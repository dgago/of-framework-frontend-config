/**
 * Clase que abstrae el acceso a localStorage, serializando y
 * deserializando los objetos convenientemente para facilidad
 * de uso.
 */
class OfLocalStorageService {
  /**
   * Guarda un elemento serializado en localStorage
   * @param key Clave de localStorage
   * @param item Valor a guardar
   */
  public setItem(key: string, item: any) {
    if (item != null) {
      localStorage.setItem(key, JSON.stringify(item));
    } else {
      localStorage.removeItem(key);
    }
  }

  /**
   * Obtiene un elemento de localStorage
   * @param key Clave de localStorage
   */
  public getItem(key: string) {
    const item = localStorage.getItem(key);
    return JSON.parse(item);
  }

  /**
   * Remueve un elemento de localStorage
   * @param key Clave de localStorage
   */
  public removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
