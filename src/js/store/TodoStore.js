var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionConstants = require('./../constants/ActionConstants'),
    moment = require('moment'),
    TodoCollection = require('./../collection/TodoCollection'),
    store = require('store');

/**
 * @type {Array}
 *
 * @private
 */
var _todos = new TodoCollection(store.get('todos', []));

var CHANGE_EVENT = 'change';

var _generateId = function () {
    return (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
};

/**
 * @param {String} title
 * @param {String=} collection
 * @param {Object=} date
 *
 * @returns {Object}
 *
 * @private
 */
var _createTodo = function (title, collection, date) {
    return {
        id: _generateId(),
        title: title,
        isCompleted: false,
        date: date || moment().format('YYYY-MM-DD'),
        collection: collection || 'today'
    };
};

/*var temp = [];

temp.push(_createTodo('eerste'));
temp.push(_createTodo('tweede'));
temp.push(_createTodo('derde'));
temp.push(_createTodo('tomorrow 1', moment('2015-09-04'), 'tomorrow'));
temp.push(_createTodo('tomorrow 2', moment('2015-09-05'), 'tomorrow'));

store.set('todos', temp);*/

var _persistCollection = function () {
    console.log('persist collection');

    store.set('todos', _todos.data);
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
    _todos.add(_createTodo(action.title, action.collection, action.date));

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

        this.emit(CHANGE_EVENT);

        return this;
    },

    /**
     *
     * @param {Function} callback
     *
     * @returns {TodoStore}
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);

        return this;
    },

    /**
     * @param {Function} callback
     *
     * @returns {TodoStore}
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);

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
