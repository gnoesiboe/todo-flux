var _ = require('underscore'),
    React = require('react'),
    TodoComponent = require('./TodoComponent'),
    SortableMixin = require('sortablejs/react-sortable-mixin'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    TodoStore = require('./../store/TodoStore');

var TodoListItemsComponent = React.createClass({

    mixins: [SortableMixin],

    /**
     * Options for the sortable mixin to define which collection is to be sorted
     * and which components are linked so they can share items
     */
    sortableOptions: {
        group: 'todos',
        model: 'todos'
    },

    /**
     * Gets called when this component is the receiving
     *
     * @param {Object} event
     */
    handleSort: function (event) {
        var oldCollection = event.from.attributes['data-collection'].value,
            newCollection = event.to.attributes['data-collection'].value,
            id = event.item.attributes['data-id'].value,
            oldIndex = event.oldIndex,
            newIndex = event.newIndex;

        // clone the original todo to ensure no strange behaviour occurs when this todo is passed around
        // the application
        var todo = _.extend({}, TodoStore.get(oldCollection).getAll().data[oldIndex]);

        var action = oldCollection === newCollection
            ? ActionFactory.buildChangePositionAction(id, newIndex, newCollection)
            : ActionFactory.buildChangeCollectionAction(todo, oldCollection, newCollection, newIndex);

        AppDispatcher.dispatch(action);
    },

    /**
     * Renders this component into it's container element
     *
     * @returns {XML}
     */
    render: function () {
        var todoComponents = [];

        for (var key in this.props.todos) {
            if (this.props.todos.hasOwnProperty(key)) {
                var todo = this.props.todos[key],
                    itemKey = todo.id;

                todoComponents.push(
                    <TodoComponent todo={todo} key={itemKey} ref="todo" />
                );
            }
        }

        return (
            <ul className="list-group todo-list" data-collection={this.props.collection}>{todoComponents}</ul>
        )
    }
});

module.exports = TodoListItemsComponent;
