var React = require('react'),
    TodoComponent = require('./TodoComponent'),
    SortableMixin = require('sortablejs/react-sortable-mixin');

var TodoListItemsComponent = React.createClass({

    mixins: [SortableMixin],

    sortableOptions: {
        group: 'todos',
        model: 'todos'
    },

    handleSort: function (event) {
        var toCollection = event.to.attributes['data-collection'].value,
            todoId = event.item.attributes['data-id'].value,
            oldIndex = event.oldIndex,
            newIndex = event.newIndex;

        console.log('handle sort', toCollection, todoId, oldIndex, newIndex);
    },

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
