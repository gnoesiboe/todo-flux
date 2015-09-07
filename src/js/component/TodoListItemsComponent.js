var React = require('react'),
    TodoComponent = require('./TodoComponent'),
    SortableMixin = require('sortablejs/react-sortable-mixin'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory');

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
     * Gets called when
     *
     * @param {Object} event
     */
    handleSort: function (event) {
        var newCollection = event.to.attributes['data-collection'].value,
            id = event.item.attributes['data-id'].value,
            newIndex = event.newIndex;

        AppDispatcher.dispatch(
            ActionFactory.buildChangePositionAction(id, newIndex, newCollection)
        );
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
                var todo = this.props.todos[key];

                todoComponents.push(
                    <TodoComponent todo={todo} key={todo.id} ref="todo" />
                );
            }
        }

        return (
            <ul className="list-group" data-collection={this.props.collection}>{todoComponents}</ul>
        )
    }
});

module.exports = TodoListItemsComponent;
