(function () {
    var _ = function () { }

    module.exports = _;

    var ArrayProto = Array.prototype, ObjProto = Object.prototype;

    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var isArray = Array.isArray;

    _.shallowProperty = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    //借鉴python内置函数len
    _.len = function(collection) {
        if (collection == null) return void 0;
        if (collection['length'] != void 0) return collection['length'];
        if (collection['size'] != void 0) return collection['size'];
        return void 0;
    };

    //借鉴python内置函数print
    _.print = function () {
        if (arguments.length == 1) {
            console.log.call(null, arguments[0]);
        } else if (arguments.length > 1) {
            console.log.call(null, slice.call(arguments).join(', '));
        } else {
            throw new Error('print needs 1 argument at least');
        }
    };

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    var getLength = _.shallowProperty('length');

    _.isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;        
    };

    _.keys = function(obj) {
        if (!isObject(obj)) return [];
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;        
    };

})();