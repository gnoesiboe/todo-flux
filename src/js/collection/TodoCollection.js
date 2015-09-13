var _ = require('underscore');

/**
 * @param {Array} todos
 *
 * @constructor
 */
var TodoCollection = function (todos) {

    /**
     * @type {Array}
     */
    this.data = null;

    TodoCollection.prototype._init.apply(this, arguments);
};

_.extend(TodoCollection.prototype, {

    /**
     * @param {Array} todos
     *
     * @private
     */
    _init: function (todos) {
        this.data = todos;
    },

    /**
     * @param {Number} index
     * @returns {TodoCollection}
     */
    deleteIndex: function (index) {
        this.data.splice(index, 1);

        return this;
    },

    /**
     * @param {String} id
     * @returns {TodoCollection}
     */
    deleteTodo: function (id) {
        var todoIndex = this.find(id);

        if (!_.isNumber(todoIndex)) {
            return this;
        }

        this.deleteIndex(todoIndex);
    },

    /**
     * @param {Object} todo
     * @param {Number=} index
     *
     * @returns {TodoCollection}
     */
    add: function (todo, index) {
        if (typeof index === 'undefined') {
            this.data.push(todo);
        } else {
            this.data.splice(index, 0, todo);
        }

        return this;
    },

    /**
     * @param {Function} callback
     *
     * @returns {Object}
     */
    first: function (callback) {
        for (var i = 0, l = this.data.length; i < l; i++) {
            var item = this.data[i];

            if (callback(item)) {
                return item;
            }
        }

        return null;
    },

    /**
     * @param {Function} callback
     *
     * @returns {Array}
     */
    filter: function (callback) {
        var out = [];

        for (var i = 0, l = this.data.length; i < l; i++) {
            var item = this.data[i];

            if (callback(item)) {
                out.push(item);
            }
        }

        return out;
    },

    /**
     * @returns {Number}
     */
    count: function () {
        return this.data.length;
    },

    /**
     * @param {Number} index
     *
     * @returns {Object|null}
     */
    getAtIndex: function (index) {
        return typeof this.data[index] !== 'undefined' ? this.data[index] : null;
    },

    /**
     * @param {String} id
     *
     * @returns {Number|null}
     */
    find: function (id) {
        for (var i = 0, l = this.data.length; i < l; i++) {
            var item = this.data[i];

            if (item.id === id) {
                return i;
            }
        }

        return null;
    },

    getData: function () {
        return this.data;
    }
});

module.exports = TodoCollection;
