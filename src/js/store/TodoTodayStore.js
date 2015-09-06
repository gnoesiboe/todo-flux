var _ = require('underscore'),
    TodoStore = require('./TodoStore');

/**
 * @constructor
 */
var TodoTodayStore = function () {

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
    this._collection = 'today';

    TodoTodayStore.prototype._init.apply(this, arguments);
};

_.extend(TodoTodayStore.prototype, TodoStore.prototype);

module.exports = new TodoTodayStore();
