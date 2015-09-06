var _ = require('underscore'),
    TodoStore = require('./TodoStore');

/**
 * @constructor
 */
var TodoLaterStore = function () {

    /**
     * @type {Array|null}
     *
     * @private
     */
    this._todos = null;

    /**
     *
     * @type {string}
     * @private
     */
    this._collection = 'later';

    TodoLaterStore.prototype._init.apply(this, arguments);
};

_.extend(TodoLaterStore.prototype, TodoStore.prototype);

module.exports = new TodoLaterStore();
