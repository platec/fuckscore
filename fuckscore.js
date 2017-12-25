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
    _.len = _.shallowProperty('length') || _.shallowProperty('size');

    _.print = function () {
        if (arguments.length == 1) {
            console.log.call(null, arguments[0]);
        } else if (arguments.length > 1) {
            console.log.call(null, slice.call(arguments).join(', '));
        } else {
            throw new Error('print needs 1 argument at least');
        }
    }
})();