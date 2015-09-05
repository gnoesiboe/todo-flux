var React = require('react'),
    TodoListItemsComponent = require('./TodoListItemsComponent');

var TodoListComponent = React.createClass({

    render: function () {
        return (
            <div className="js-todo-list">
                <h1>{this.props.title}</h1>
                <TodoListItemsComponent todos={this.props.todos} collection={this.props.collection} />
            </div>
        );
    }
});

module.exports = TodoListComponent;
