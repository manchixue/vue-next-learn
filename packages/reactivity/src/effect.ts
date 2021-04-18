
export function effect (fn, options: any = {}) {
    // 让这个effect变成响应式的effect 数据变化可以重新执行
    const effect = createReactiveEffect(fn, options);

    if (!options.lazy) {
        effect(); // 响应式的effect默认会先执行一次
    }

    return effect;
}

let uid = 0;
let activeEffect;
const effectStack = []; // 使用栈来存储effect, 确保在effect1中嵌套effect2, effect2执行完后修正activeEffect为effect1
function createReactiveEffect (fn, options) {
    const effect = function reactiveEffect () {
        if (!effectStack.includes(effect)) {
            try { // 确保fn执行错误也能修正activeEffect
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            } finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    }
    effect.id = uid++; // 制作一个effect标识
    effect._isEffect = true; // 用于标识这个是响应式effect
    effect.raw = fn; // 保留effect对应的原函数
    effect.options = options; // 在effect上保存用户的属性
    return effect;
}
const targetMap = new WeakMap();
export function track (target, type, key) {
    if (activeEffect === 'undefined') {
        return;
    }

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map));
    }
    let deps = depsMap.get(key);
    if (!deps) {
        depsMap.set(key, (deps = new Set));
    }

    if (!deps.has(activeEffect)) {
        deps.add(activeEffect);
    }
}
