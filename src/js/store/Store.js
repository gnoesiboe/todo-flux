

/**
 * @type {Object}
 *
 * @private
 */
var _stores = {
    today: require('./TodoTodayStore')
};

/**
 * @param {String} identifier
 *
 * @private
 */
var _validateHas = function (identifier) {
    if (!store.has(identifier)) {
        throw new Error('No store registered with')
    }
};

/**
 * @type {Object}
 */
var store = {

    /**
     * @param {String} identifier
     *
     * @return {TodoStore}
     */
    get: function (identifier) {
        _validateHas(identifier);

        return _stores[identifier];
    },

    /**
     * @param {String} identifier
     *
     * @returns {boolean}
     */
    has: function (identifier) {
        return _stores.hasOwnProperty(identifier);
    }
};

module.exports = store;
