/**
 * Clase que abstrae el acceso a SessionStorage, serializando y
 * deserializando los objetos convenientemente para facilidad
 * de uso.
 */
class OfSessionStorageService {
  /**
   * Guarda un elemento serializado en SessionStorage
   * @param key Clave de SessionStorage
   * @param item Valor a guardar
   */
  public setItem(key: string, item: any) {
    if (item != null) {
      sessionStorage.setItem(key, JSON.stringify(item));
    } else {
      sessionStorage.removeItem(key);
    }
  }

  /**
   * Obtiene un elemento de SessionStorage
   * @param key Clave de SessionStorage
   */
  public getItem(key: string) {
    const item = sessionStorage.getItem(key);
    return JSON.parse(item);
  }

  /**
   * Remueve un elemento de SessionStorage
   * @param key Clave de SessionStorage
   */
  public removeItem(key: string) {
    sessionStorage.removeItem(key);
  }
}
