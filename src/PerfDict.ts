import { IDict } from './interfaces';

/**
 * A dictionary with its values redundantly stored in an array.
 * This is to increase performance for looping and measuring the size, at the cost of
 * reduced performance for adding and removing values.
 * 
 * IMPORTANT:
 * 1. Only store unique references in this. Any duplicates or primitive values cause errors.
 * 2. Do not manually edit the array or dict objects without knowing what you are doing.
 */
export interface IPerfDict<T extends object> {
  array: T[];
  dict: IDict<T>;
  
  /**
   * Add a key / value pair to the dictionary and add the value to the end of the array.
   * If the value already exists, it is replaced and its array index will be used for the new value.
   * @param key Dictionary key
   * @param value Value to add to dictionary and array
   */
  set(key: string, value: T): this;
  
  /**
   * Remove a key / value pair from the dictionary and array.
   * @param key Dictionary key
   * @returns If the key is found the old value is returned. If not, undefined is returned.
   */
  remove(key: string): T | undefined;
}

export class PerfDict<T extends object> implements IPerfDict<T> {
  array: T[] = [];
  dict: IDict<T> = {};

  set(key: string, value: T): this {
    if (key in this.dict) {
      const oldValue = this.dict[key];
      this.dict[key] = value;
      const index = this.array.indexOf(oldValue);
      if (index === -1) { throw new Error('Failed to overwrite value. Value was found in the dictionary, but not in the array.'); }
      this.array[index] = value;
    } else {
      this.dict[key] = value;
      this.array.push(value);
    }
    return this;
  }

  remove(key: string): T | undefined {
    if (key in this.dict) {
      const value = this.dict[key];
      const index = this.array.indexOf(value);
      if (index === -1) { throw new Error('Failed to overwrite value. Value was found in the dictionary, but not in the array.'); }
      this.array.splice(index, 1);
      delete this.dict[key];
      return value;
    } else {
      return undefined;
    }
  }
}
