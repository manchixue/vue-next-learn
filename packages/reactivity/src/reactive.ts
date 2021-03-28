import {
    mutableHandlers,
    shallowReactiveHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers
} from './baseHandlers'
import {isObject} from "@vue/shared";

export function reactive (target) {
    return createReactiveObject(target, false, mutableHandlers);
}

export function shallowReactive (target) {
    return createReactiveObject(target, false, shallowReactiveHandlers);
}

export function readonly (target) {
    return createReactiveObject(target, true, readonlyHandlers);
}

export function shallowReadonly (target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers);
}

const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();

export function createReactiveObject (target, isReadOnly = false, handler) {
    // 如果目标不是对象,没法拦截  reactive这个api只能拦截对象类型
    if (!isObject(target)) {
        return target;
    }

    // 用两个map: 出于考虑  一个对象可以被代理深度, 又被进度代理了.

    // 如果某个对象已经被代理过了 就不要再次进行代理
    // 直接将代理过的对象返回
    const proxyMap = isReadOnly ? readonlyMap : reactiveMap;
    const existProxy = proxyMap.get(target);
    if (existProxy) {
        return existProxy;
    }

    const proxy = new Proxy(target, handler);

    proxyMap.set(target, proxy);

    return proxy;
}
