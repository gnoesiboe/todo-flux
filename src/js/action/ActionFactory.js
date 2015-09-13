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
     * @param {Number=} index
     *
     * @returns {Object}
     */
    buildCreateAction: function (title, collection, date, index) {
        index = typeof index === 'undefined' ? null : index;

        return _.extend({}, _blueprint, {
            type: ActionConstants.TODO_CREATE,
            title: title,
            collection: collection,
            date: date,
            index: index
        });
    },

    /**
     * @param {String} id
     * @param {String} title
     * @param {String} date
     *
     * @returns {Object}
     */
    buildEditAction: function (id, title, date) {
        return _.extend({}, _blueprint, {
            type: ActionConstants.TODO_EDIT,
            id: id,
            title: title,
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
    },

    /**
     * @returns {Object}
     */
    buildDeleteCurrentTodoAction: function () {
        return _.extend({}, _blueprint, {
            type: ActionConstants.TODO_DELETE_CURRENTLY_SELECTED
        });
    },

    /**
     * @returns {Object}
     */
    buildEnterTodoEditModeAction: function () {
        return _.extend({}, _blueprint, {
            type: ActionConstants.TODO_ENTER_EDIT_MODE
        });
    },

    /**
     * @param {String} id
     * @param {Number} newIndex
     * @param {String} newCollection
     *
     * @returns {Object}
     */
    buildChangePositionAction: function (id, newIndex, newCollection) {
        return _.extend({}, _blueprint, {
            type: ActionConstants.TODO_CHANGE_POSITION,
            id: id,
            newIndex: newIndex,
            newCollection: newCollection
        });
    },

    /**
     * @param {Object} todo
     * @param {String} oldCollection
     * @param {String} newCollection
     * @param {Number} newIndex
     *
     * @returns {Object}
     */
    buildChangeCollectionAction: function (todo, oldCollection, newCollection, newIndex) {
        return _.extend({}, _blueprint, {
            type: ActionConstants.TODO_CHANGE_COLLECTION,
            todo: todo,
            oldCollection: oldCollection,
            newCollection: newCollection,
            newIndex: newIndex
        });
    }
};

module.exports = ActionFactory;
