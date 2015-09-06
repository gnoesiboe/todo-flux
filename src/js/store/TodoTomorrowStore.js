var _ = require('underscore'),
    TodoStore = require('./TodoStore');

/**
 * @constructor
 */
var TodoTomorrowStore = function () {

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
    this._collection = 'tomorrow';

    TodoTomorrowStore.prototype._init.apply(this, arguments);
};

_.extend(TodoTomorrowStore.prototype, TodoStore.prototype);

module.exports = new TodoTomorrowStore();
