var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionConstants = require('./../constants/ActionConstants'),
    EventConstants = require('./../constants/EventConstants'),
    TodoCollection = require('./../collection/TodoCollection'),
    store = require('store'),
    todoFactory = require('./../factory/todoFactory');

var STORAGE_NAMESPACE = 'todos';

/**
 * @type {Array}
 *
 * @private
 */
var _todos = new TodoCollection(store.get(STORAGE_NAMESPACE, []));

/**
 * Saves the current state of the todo collection in the browser's
 * local storage
 *
 * @private
 */
var _persistCollection = function () {
    console.log('persist collection');

    store.set(STORAGE_NAMESPACE, _todos.data);
};

/**
 * @param {String} id
 *
 * @return {Boolean}
 *
 * @private
 */
var _deleteTodo = function (id) {
    _todos.deleteTodo(id);

    _persistCollection();
};

/**
 * @param {String} id
 * @param {Object} updates
 *
 * @return {Object|null}
 *
 * @private
 */
var _updateTodo = function (id, updates) {
    var todoIndex = _todos.find(id);

    if (!_.isNumber(todoIndex)) {
        return;
    }

    _todos.data[todoIndex] = _.extend({}, _todos.data[todoIndex], updates);

    _persistCollection();
};

/**
 * @param {Object} action
 *
 * @private
 */
var _handleTodoCreate = function (action) {
    _todos.add(todoFactory.createTodo(action.title, action.collection, action.date));

    _persistCollection();

    TodoStore.emitChange();
};

/**
 * @param {Object} action
 *
 * @private
 */
var _handleTodoUncompleted = function (action) {
    _updateTodo(action.id, {
        isCompleted: false
    });

    TodoStore.emitChange();
};

/**
 * @param {Object} action
 *
 * @private
 */
var _handleTodoCompleted = function (action) {
    _updateTodo(action.id, {
        isCompleted: true
    });

    TodoStore.emitChange();
};

/**
 * @param {Object} action
 *
 * @private
 */
var _handleTodoDelete = function (action) {
    _deleteTodo(action.id);

    TodoStore.emitChange();
};

/**
 * @type {Object}
 */
var TodoStore = _.extend({}, EventEmitter.prototype, {

    /**
     * @returns {Array}
     */
    getAll: function () {
        return _todos;
    },

    /**
     * @returns {TodoStore}
     */
    emitChange: function() {
        console.log('EMIT: change event');

        this.emit(EventConstants.TODO_COLLECTION_CHANGE);

        return this;
    },

    /**
     *
     * @param {Function} callback
     *
     * @returns {TodoStore}
     */
    addChangeListener: function (callback) {
        this.on(EventConstants.TODO_COLLECTION_CHANGE, callback);

        return this;
    },

    /**
     * @param {Function} callback
     *
     * @returns {TodoStore}
     */
    removeChangeListener: function (callback) {
        this.removeListener(EventConstants.TODO_COLLECTION_CHANGE, callback);

        return this;
    }
});

AppDispatcher.register(function (action) {
    switch (action.type) {
        case ActionConstants.TODO_CREATE:
            _handleTodoCreate(action);
            break;

        case ActionConstants.TODO_COMPLETED:
            _handleTodoCompleted(action);
            break;

        case ActionConstants.TODO_UNCOMPLETED:
            _handleTodoUncompleted(action);
            break;

        case ActionConstants.TODO_DELETE:
            _handleTodoDelete(action);
            break;

        default:
            console.log('TodoStore did not handle:', action);
    }
});

module.exports = TodoStore;
