var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    ActionConstants = require('./../constants/ActionConstants'),
    EventConstants = require('./../constants/EventConstants'),
    TodoCollection = require('./../collection/TodoCollection'),
    store = require('store'),
    todoFactory = require('./../factory/todoFactory');

/**
 * @type {Object}
 *
 * @private
 */
var _stores = {};

/**
 * @constructor
 */
var TodoStore = function (collection) {

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
    this._collection = null;

    TodoStore.prototype._init.apply(this, arguments);
};

_.extend(TodoStore.prototype, EventEmitter.prototype, {

    /**
     * @private
     */
    _init: function (collection) {
        this._collection = collection;

        this._initEventListeners();
    },

    /**
     * @private
     */
    _initEventListeners: function () {
        AppDispatcher.register(this._onActionReceived.bind(this));
    },

    /**
     * @param {Object} action
     *
     * @private
     */
    _onActionReceived: function (action) {
        switch (action.type) {
            case ActionConstants.TODO_CREATE:
                this._handleTodoCreate(action);
                break;

            case ActionConstants.TODO_COMPLETED:
                this._handleTodoCompleted(action);
                break;

            case ActionConstants.TODO_UNCOMPLETED:
                this._handleTodoUncompleted(action);
                break;

            case ActionConstants.TODO_DELETE:
                this._handleTodoDelete(action);
                break;

            case ActionConstants.TODO_CHANGE_POSITION:
                this._handleChangePosition(action);
                break;

            case ActionConstants.TODO_CHANGE_COLLECTION:
                this._handleChangeCollection(action);
                break;

            default:
                // do nothing as this action does not concern this store
                break;
        }
    },

    /**
     * @param {Object} action
     *
     * @private
     */
    _handleChangePosition: function (action) {
        var currentTodoIndex = this._todos.find(action.id);

        if (currentTodoIndex === null) {
            return;
        }

        this._moveTodoToNewIndex(currentTodoIndex, action.newIndex);
    },

    /**
     * @param {Object} action
     *
     * @private
     */
    _handleChangeCollection: function (action) {
        if (action.oldCollection === this._collection) {
            this._deleteTodo(action.todo.id);

            this._emitChange();
        } else if (action.newCollection === this._collection) {
            var todo = action.todo;

            todo.collection = this._collection;

            this._todos.add(todo, action.newIndex);

            this._persistCollection();

            this._emitChange();
        }
    },

    /**
     * @param {Number} oldIndex
     * @param {Number} newIndex
     *
     * @private
     */
    _moveTodoToNewIndex: function (oldIndex, newIndex) {
        var todos = this._todos.data;

        todos.splice(
            newIndex,
            0,
            todos.splice(oldIndex, 1)[0]
        );

        this._todos.data = todos;

        this._persistCollection();

        this._emitChange();
    },

    /**
     * @param {Object} action
     *
     * @private
     */
    _handleTodoDelete: function (action) {
        this._deleteTodo(action.id);

        this._emitChange();
    },

    /**
     * @param {String} id
     *
     * @return {Boolean}
     *
     * @private
     */
    _deleteTodo: function (id) {
        this._todos.deleteTodo(id);

        this._persistCollection();
    },

    /**
     * @param {Object} action
     *
     * @private
     */
    _handleTodoUncompleted: function (action) {
        this._updateTodo(action.id, {
            isCompleted: false
        });

        this._emitChange();
    },

    /**
     * @param {String} id
     * @param {Object} updates
     *
     * @return {Object|null}
     *
     * @private
     */
    _updateTodo: function (id, updates) {
        var todoIndex = this._todos.find(id);

        if (todoIndex === null) {
            return;
        }

        this._todos.data[todoIndex] = _.extend({}, this._todos.data[todoIndex], updates);

        this._persistCollection();
    },

    /**
     * @param {Object} action
     *
     * @private
     */
    _handleTodoCompleted: function (action) {
        this._updateTodo(action.id, {
            isCompleted: true
        });

        this._emitChange();
    },

    /**
     * Saves the current state of the todo collection in the browser's
     * local storage
     *
     * @private
     */
    _persistCollection: function () {
        store.set(this._collection, this._todos.data);
    },

    /**
     * @param {Object} action
     *
     * @private
     */
    _handleTodoCreate: function (action) {
        if (action.collection !== this._collection) {
            return;
        }

        this._todos.add(todoFactory.createTodo(
            action.title,
            action.collection,
            action.date
        ));

        this._persistCollection();

        this._emitChange();
    },

    /**
     * @returns {TodoCollection}
     *
     * @private
     */
    _importTodosFromStore: function () {
        return new TodoCollection(
            store.get(this._collection, [])
        )
    },

    /**
     * @private
     */
    _emitChange: function () {
        this.emit(EventConstants.TODO_COLLECTION_CHANGE);
    },

    /**
     * @returns {TodoCollection}
     */
    getAll: function () {
        if (this._todos === null) {
            this._todos = this._importTodosFromStore();
        }

        return this._todos;
    },

    /**
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

// export the public interface
module.exports = {

    /**
     * @param {String} collection
     *
     * @returns {TodoStore}
     */
    register: function (collection) {
        _stores[collection] = new TodoStore(collection);

        return _stores[collection];
    },

    /**
     * @param {String} collection
     *
     * @returns {TodoStore}
     */
    get: function (collection) {
        return typeof _stores[collection] !== 'undefined' ? _stores[collection] : null;
    }
};
