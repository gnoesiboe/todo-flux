var React = require('react'),
    TodoComponent = require('./TodoComponent'),
    _ = require('underscore');

var TodoListComponent = React.createClass({
    render: function () {
        var todoComponents = [];

        for (var key in this.props.todos) {
            if (this.props.todos.hasOwnProperty(key)) {
                var todo = this.props.todos[key];

                todoComponents.push(
                    <TodoComponent todo={todo} sort={this.sort} key={todo.id} />
                );
            }
        }

        return (
            <div className="js-todo-list">
                <h1>{this.props.title}</h1>
                <ul className="list-group">{todoComponents}</ul>
            </div>
        );
    }
});

module.exports = TodoListComponent;
