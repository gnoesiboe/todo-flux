var _ = require('underscore'),
    React = require('react'),
    TodoComponent = require('./TodoComponent'),
    SortableMixin = require('sortablejs/react-sortable-mixin'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    TodoStore = require('./../store/TodoStore'),
    mousetrap = require('mousetrap');

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

        for (var index in this.props.todos) {
            if (this.props.todos.hasOwnProperty(index)) {
                var todo = this.props.todos[index],
                    key = todo.id,
                    isCurrentTodo= this.props.isCurrentCollection && this.props.currentTodoIndex == index;

                todoComponents.push(
                    <TodoComponent todo={todo} key={key} ref="todo" current={isCurrentTodo} />
                );
            }
        }

        return (
            <ul className="list-group todo-list" data-collection={this.props.collection}>{todoComponents}</ul>
        )
    }
});

module.exports = TodoListItemsComponent;
