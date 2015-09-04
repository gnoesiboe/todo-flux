var _ = require('underscore'),
    ActionConstants = require('./../constants/ActionConstants');

/**
 * @type {Object}
 *
 * @private
 */
var _blueprint = {
    type: null
};

/**
 * @type {Object}
 */
var ActionFactory = {

    /**
     * @param {String} title
     * @param {String} collection
     * @param {String} date
     *
     * @returns {Object}
     */
    buildCreateAction: function (title, collection, date) {
        return _.extend({}, _blueprint, {
            type: ActionConstants.TODO_CREATE,
            title: title,
            collection: collection,
            date: date
        });
    },

    /**
     * @param {Object} todo
     *
     * @returns {Object}
     */
    buildDeleteAction: function (todo) {
        return _.extend({}, _blueprint, {
            type: ActionConstants.TODO_DELETE,
            id: todo.id
        });
    },

    /**
     * @param {Object} todo
     *
     * @returns {Object}
     */
    buildChangeCompleteStatusAction: function (todo) {
        var newIsCompletedState = !todo.isCompleted;

        var type = newIsCompletedState ? ActionConstants.TODO_COMPLETED : ActionConstants.TODO_UNCOMPLETED

        return _.extend({}, _blueprint, {
            type: type,
            id: todo.id
        });
    }
};

module.exports = ActionFactory;
