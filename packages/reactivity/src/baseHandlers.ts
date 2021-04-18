import {extend, isObject} from "@vue/shared";
import {readonly, reactive} from "./reactive";
import {track} from "./effect";
import {TrackOpTypes} from "./operators";

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter();

export const mutableHandlers = {
    get,
    set
};
const readonlyObj = {
    set(target, key) {
        console.warn(`${target} on ${key} failed`)
    }
}
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
};
export const readonlyHandlers = extend({
    get: readonlyGet
}, readonlyObj);
export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet
}, readonlyObj);


function createGetter(isReadonly = false, shallow = false) {
    return function get (target, key, receiver) {
        const result = Reflect.get(target, key, receiver)

        // 只读
        if (!isReadonly) {

            // 收集依赖
            track(target, TrackOpTypes.GET, key);
        }
        // 深度
        if (shallow) {
            return result;
        }
        if (isObject(result)) {
            return isReadonly ? readonly(result) : reactive(result)
        }

        return result;
    }
}

function createSetter() {
    return function set (target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)

        return result;
    }
}
