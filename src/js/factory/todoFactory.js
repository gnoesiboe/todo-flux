var moment = require('moment'),
    idGenerator = require('./../utilities/idGenerator');

var DEFAULT_COLLECTION = 'today';

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
            isCompleted: false,
            date: date || moment().format('YYYY-MM-DD'),
            collection: collection || DEFAULT_COLLECTION
        };
    }
};

module.exports = todoFactory;
