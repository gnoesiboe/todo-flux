var moment = require('moment'),
    idGenerator = require('./../utilities/idGenerator'),
    _ = require('underscore');

var DEFAULT_COLLECTION = 'today',
    DEFAULT_INDENTATION = 0,
    DEFAULT_IS_COMPLETED_VALUE = false;

/**
 * @type {Object}
 */
var todoFactory = {

    /**
     * @param {String} title
     * @param {String} collection
     * @param {String} date
     */
    createTodo: function (title, collection, date) {
        return {
            id: idGenerator.generateId(),
            title: title,
            isCompleted: DEFAULT_IS_COMPLETED_VALUE,
            date: date || moment().format('YYYY-MM-DD'),
            collection: collection || DEFAULT_COLLECTION,
            indentation: DEFAULT_INDENTATION
        };
    },

    /**
     * Normalizes the input from the store so we always know for sure that
     * certain fields exist.
     *
     * @param {Object} storeTodo
     *
     * @returns {Object}
     */
    createFromStoreTodo: function (storeTodo) {
        return _.extend({
            id: null,
            title: null,
            isCompleted: DEFAULT_IS_COMPLETED_VALUE,
            date: moment().format('YYYY-MM-DD'),
            collection: DEFAULT_COLLECTION,
            indentation: DEFAULT_INDENTATION
        }, storeTodo);
    }
};

module.exports = todoFactory;
