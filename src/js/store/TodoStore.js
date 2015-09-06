var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionConstants = require('./../constants/ActionConstants'),
    EventConstants = require('./../constants/EventConstants'),
    TodoCollection = require('./../collection/TodoCollection'),
    store = require('store'),
    todoFactory = require('./../factory/todoFactory');

var TodoStore = function () {

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
    this._storageNamespace = 'todos';

    TodoStore.prototype._init.apply(this, arguments);
};

_.extend(TodoStore.prototype, EventEmitter.prototype, {

    /**
     * @private
     */
    _init: function () {
        this._initEventListeners();
    },

    /**
     * @private
     */
    _initEventListeners: function () {
        AppDispatcher.register(function (action) {
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

                default:
                    console.log('TodoStore did not handle:', action);
            }
        }.bind(this));
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
        store.set(this._storageNamespace, this._todos.data);
    },

    /**
     * @param {Object} action
     *
     * @private
     */
    _handleTodoCreate: function (action) {
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
            store.get(this._storageNamespace, [])
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

module.exports = new TodoStore();
