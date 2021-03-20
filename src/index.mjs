import AsyncStorage from '@react-native-async-storage/async-storage';

class BfastReactNativeCache {

  /**
   * 
   * @param identifier {string}
   * @param data {any}
   * @param database {string}
   * @param collection {string}
   * @param options {{
      dtl?: number,
      secure?: boolean,
    }}
   * @returns {Promise<*>}
   */
  async set(
    identifier,
    data,
    database,
    collection,
    options,
  ) {
    const _id = this._getIdentifier(database, collection, identifier);
    if (data === undefined || data === null) {
      return this.remove(identifier, database, collection, true);
    } else {
      await AsyncStorage.setItem(_id, JSON.stringify(data));
      return this.get(identifier, database, collection, options);
    }
  }

  /**
   * 
   * @param identifier {string}
   * @param database {string}
   * @param collection {string}
   * @returns {Promise<*>}
   */
  async get(
    identifier,
    database,
    collection,
  ){
    const _id = this._getIdentifier(database, collection, identifier);
    const result = await AsyncStorage.getItem(_id);
    if (result) {
      return JSON.parse(result);
    } else {
      return result;
    }
  }

  /**
   * 
   * @param database {string}
   * @param collection {string}
   * @returns {Promise<string[]>}
   */
  async keys(database, collection) {
    const identifierPrefix = this._getIdentifierPrefix(database, collection);
    const keys = await AsyncStorage.getAllKeys();
    if (keys && Array.isArray(keys)) {
      return keys.filter((x) => {
        return x.toString().startsWith(identifierPrefix);
      });
    } else {
      return [];
    }
  }

  /**
   * 
   * @param database {string}
   * @param collection {string}
   * @returns {Promise<boolean>}
   */
  async clearAll(database, collection) {
    try {
      const keys = await this.keys(database, collection);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * 
   * @param identifier {string}
   * @param database {string}
   * @param collection {string}
   * @param force {boolean}
   * @returns {Promise<boolean>}
   */
  async remove(
    identifier,
    database,
    collection,
    force = null,
  ) {
    try {
      await AsyncStorage.removeItem(
        this._getIdentifier(database, collection, identifier),
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 
   * @param appName {string}
   * @param options {*}
   * @returns {boolean}
   */
  cacheEnabled(appName, options= null) {
    return true;
  }

  /**
   * 
   * @param database {string}
   * @param collection {string}
   * @returns {string}
   */
  _getIdentifierPrefix(database, collection) {
    const dbParts = database.toString().split('/');
    const dbName = dbParts[dbParts.length - 1];
    const collName = collection.toString().split('/')[0];
    return `${dbName}${collName}`;
  }

  /**
   * 
   * @param database {string}
   * @param collection {string}
   * @param identifier {string}
   * @returns {string}
   */
  _getIdentifier(database, collection, identifier) {
    const dbParts = database.toString().split('/');
    const dbName = dbParts[dbParts.length - 1];
    const collName = collection.toString().split('/')[0];
    return `${dbName}${collName}${identifier}`;
  }
}

export default BfastCacheService;
