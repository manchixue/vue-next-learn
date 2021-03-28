export const isObject = (val: unknown): val is Record<any, any> => typeof val === 'object' && val !== null;


export const extend = Object.assign;
