/**
 * Created by platec
 * Released under the MIT license
 * version 0.1
 */
;(function () {
    var ArrayProto = Array.prototype, ObjProto = Object.prototype;

    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var isArray = Array.isArray;

    function shallowProperty(key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    }

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    var getLength = shallowProperty('length');

    function isArrayLike(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    }

    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    function keys(obj) {
        if (!isObject(obj)) return [];
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    }

    function each(obj, iteratee, context) {
        iteratee = bind(iteratee, context);
        if (isArrayLike(obj)) {
            var length = getLength(obj), index;
            for (index = 0; index < length; index++) {
                iteratee(obj[index], index, obj);
            }
        } else {
            var keys = keys(obj),
                length = keys.length,
                index;
            for (index = 0; index < length; index++) {
                iteratee(obj[keys[index]], keys[index], obj);
            }
        }
        return obj;
    }

    function map(obj, iteratee, context) {
        iteratee = bind(iteratee, context);
        var result = [];
        if (isArrayLike(obj)) {
            var length = getLength(obj), index;
            for (index = 0; index < length; index++) {
                result.push(iteratee(obj[index], index, obj));
            }
        } else {
            var keys = objectKeys(obj),
                length = keys.length,
                index;
            for (index = 0; index < length; index++) {
                result.push(iteratee(obj[keys[index]], keys[index], obj));
            }
        }
        return result;
    }

    function reduce(obj, iteratee, memo) {
        memo = memo || obj[0];
        var index = memo ? 0 : 1,
            length = obj.length;
        for (; index < length; index++) {
            memo = iteratee(memo, obj[index]);
        }
        return memo;
    }

    function reduceRight(obj, iteratee, memo) {
        memo = memo || obj[obj.length - 1];
        var index = memo ? obj.length - 1 : obj.length - 2,
            length = obj.length;
        for (; index >= 0; index--) {
            memo = iteratee(memo, obj[index]);
        }
        return memo;
    }

    function find(obj, predicate) {
        var length = obj.length, i;
        for (i = 0; i < length; i++) {
            if (predicate(obj[i], i, obj)) {
                return obj[i];
            }
        }
        return void 0;
    }

    function filter(obj, predicate) {
        var result = [];
        each(obj, function (v, i) {
            if (predicate(obj[i], i, obj)) {
                result.push(obj[i]);
            }
        });
        return result;
    }

    function extend(to, from) {
        each(from, function (v, i) {
            to[i] = v;
        })
        return to;
    }

    function isMatch(obj, attrs) {
        var item;
        for (item in obj) {
            if (attrs[item] !== obj[item] || !(item in obj)) {
                return false;
            }
        }
        return true;
    }

    function matcher(attrs) {
        attrs = extend({}, attrs);
        return function (obj) {
            return isMatch(obj, attrs);
        }
    }

    function where(obj, attrs) {
        return filter(obj, matcher(attrs));
    }

    function findWhere(obj, attrs) {
        return find(obj, matcher(attrs));
    }

    function reject(obj, predicate) {
        return filter(obj, negate(predicate));
    }

    function negate(func) {
        return function () {
            return !func.apply(this, arguments);
        }
    }

    function every(obj, predicate) {
        var keys = !isArrayLike(obj) && keys(obj),
            length = (keys || obj).length;
        for (i = 0; i < length; i++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) {
                return false;
            }
        }
        return true;
    }

    function some(obj, predicate) {
        var keys = !isArrayLike(obj) && keys(obj),
            length = (keys || obj).length;
        for (i = 0; i < length; i++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) {
                return true;
            }
        }
        return false;
    }

    function contains(obj, value, fromIndex) {
        fromIndex = fromIndex || 0;
        if (isArray(obj)) {
            return obj.indexOf(value) >= 0;
        } else {
            var length = obj.length, i;
            for (i = 0; i < length; i++) {
                if (value === obj[i]) {
                    return true;
                }
            }
            return false;
        }
    }

    function invoke(obj, methodName) {
        var args = arguments.length > 2 && slice.apply(arguments, 2);
        return map(obj, function (v) {
            return v[methodName].call(v, args);
        })
    }

    function pluck(obj, attr) {
        return map(obj, function (v) {
            return v[attr];
        });
    }

    function first(array, n) {
        if (array == null || array.length < 1) return void 0;
        if (n == null) return array[0];
        return initial(array, n);
    }

    function initial(array, n) {
        return slice.call(array, 0, Math.min(n, array.length))
    }

    function last(array, n) {
        if (array == null || array.length < 1) return void 0;
        if (n == null) return array[array.length - 1];
        return rest(array, array.length - n);
    }

    function rest(array, index) {
        if (index == null) return slice.call(array, 1);
        return slice.call(array, index);
    }

    function compact(array) {
        return filter(array, Boolean);
    }

    function flatten(array, shallow) {
        var result = [], index = 0;
        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            if (isArray(value)) {
                if (!shallow) value = flatten(value);
                var j = 0, len = value.length;
                while (j < len) {
                    result[index++] = value[j];
                    j++;
                }
            } else {
                result[index++] = value;
            }
        }
        return result;
    }

    function without(array) {
        var args = slice.call(arguments, 1);
        var result = [];
        each(array, function (value) {
            if (args.index(value) < 0) {
                result.push(value);
            }
        });
        return result;
    }

    function uniq(array) {
        var output = [];
        each(array, function (value) {
            if (output.indexOf(value) < 0) {
                output.push(value);
            }
        });
        return output;
    }

    function union() {
        return uniq(flatten(arguments));
    }

    function intersection(array) {
        var result = [];
        var args = slice.call(arguments, 0);
        for (var i = 0; i < array.length; i++) {
            var cmp = array[i];
            for (var j = 1; j < args.length; j++) {
                if (!contains(args[j], cmp)) break;
            }
            if (j === args.length) result.push(cmp);
        }
        return result;
    }

    function difference(array) {
        var result = [];
        var args = slice.call(arguments, 0);
        for (var i = 0; i < array.length; i++) {
            var cmp = array[i];
            for (var j = 1; j < args.length; j++) {
                if (contains(args[j], cmp)) break;
            }
            if (j === args.length) result.push(cmp);
        }
        return result;
    }

    function zip(array) {
        var result = [];
        var args = slice.call(arguments, 0);
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < args.length; j++) {
                result[i] = result[i] || [];
                var value = args[j][i] || void 0;
                result[i] && result[i].push(args[j][i]);
            }
        }
        return result;
    }

    function unzipArgs(func) {
        return function () {
            var args = [];
            each(arguments[0], function (v, i) {
                args[i] = v;
            });
            arguments = args;
            return func.apply(this, arguments);
        }
    }

    var unzip = unzipArgs(zip);

    function object(array, value) {
        var output = {};
        each(array, function (v, i) {
            if (value) {
                output[v] = value[i];
            } else {
                output[v[0]] = v[1];
            }

        });
        return output;
    }

    function range(start, stop, step) {
        var output = [];
        if (stop === null) {
            stop = start || 0;
            start = 0;
        }
        if (!step) {
            step = stop < start ? -1 : 1;
        }
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        for (var i = 0; i < length; i++ , start += step) {
            output.push(start);
        }
        return output;
    }

    function binarySearch(array, value, low, high) {
        low = low || 0;
        high = high || array.length - 1;
        var mid = Math.floor((low + high) / 2);
        if (low <= high) {
            if (value === array[mid]) return mid;
            else if (value < array[mid]) return binarySearch(array, value, low, mid - 1);
            else return binarySearch(array, value, mid + 1, high);
        }
        return -1;
    }

    function indexOf(array, value, sorted) {
        if (sorted) return binarySearch(array, value);
        if (array.indexOf) return array.indexOf(value);
        for (var i = 0; i < array.length; i++) {
            if (value === array[i]) return i;
        }
        return -1;
    }

    function lastIndexOf(array, value, index) {
        if (array.lastIndexOf) return array.lastIndexOf(value);
        for (var i = array.length - 1; i >= 0; i--) {
            if (value === array[i]) return i;
        }
        return -1;
    }

    function findIndex(array, predicate) {
        for (var i = 0; i < array.length; i++) {
            if (predicate(array[i], i, array)) {
                return i;
            }
        }
        return -1;
    }

    function bind(func, context) {
        return function () {
            func.apply(context, arguments);
        }
    }

    function bindAll(obj) {
        if (arguments.length <= 1) console.error('arguments not enough!');
        for (var key in obj) {
            obj[key] = bind(obj[key], obj);
        }
    }

    function partial(func) {
        var args = arguments, bound = [];
        each(args, function (v, i) {
            if (i > 0) {
                bound.push(v);
            }
        });
        return function () {
            arguments = Array.from(arguments);
            arguments.unshift(bound);
            return func.apply(null, arguments);
        };
    }

    function delay(func, wait, args) {
        return setTimeout(function () {
            func.apply(null, args);
        }, wait);
    }

    function restArgs(func) {
        return function () {

        }
    }

    var delay = unzipArgs(function (func, wait, args) {
        return setTimeout(function () {
            return func.apply(null, args)
        }, wait);
    });

    function compose() {
        var args = arguments;
        var length = arguments.length, result;
        return function () {
            result = args[0] && args[0].apply(null, arguments);
            var i = 0;
            while ( i++ < length- 1) {
                result = args[i].call(null, result);
            }
            return result;
        }
    }
    
})();