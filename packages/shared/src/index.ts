export const isObject = (val: unknown): val is Record<any, any> => typeof val === 'object' && val !== null;

export const extend = Object.assign;
export const isArray = Array.isArray;
export const isString = val => typeof val === 'string';
export const isNumber = val => typeof val === 'number';
export const isFunction = val => typeof val === 'function';
export const isIntegerKey = key => `${parseInt(key)}` === key;

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (target, key) => hasOwnProperty.call(target, key);
export const hasChanged = (oldValue, value) => oldValue !== value;
