function deepCopy(obj, cache = new WeakMap()) {
    if (!obj instanceof Object) {
        return obj;
    }
    // 防止循环引用
    if (cache.get(obj)) {
        return cache.get(obj)
    }
    // 支持函数
    if (obj instanceof Function) {
        return function() {
            obj.apply(this, arguments);
        }
    }
    // 支持日期
    if (obj instanceof Date) {
        return new Date(obj)
    }
    // 支持正则对象
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags)
    }
    // 还可以增加其他对象,比如:map, set 等,根据情况判断增加极客

    // 数组是 key 为数字的特殊对象
    const res = Array.isArray(obj) ? [] : {}

    // 缓存 copy 的对象,用于处理循环引用的情况
    cache.set(obj, res)

    Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Object) {
            res[key] = deepCopy(obj[key], cache)
        } else {
            res[key] = obj[key]
        }
    })
    return res
}

function getDate(obj) {
    d = new Date(obj);
    if (d.getHours() == 0) {
        d.setHours(8);
    }
    return d;
}