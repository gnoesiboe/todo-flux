var React = require('react'),
    TodoListItemsComponent = require('./TodoListItemsComponent');

var TodoListComponent = React.createClass({

    render: function () {

        // providing this.props.todos.data to make sure the sortable functionality work. It uses Array.slice, and this
        // cannot be used on our collection

        return (
            <div className="js-todo-list">
                <h1>{this.props.title}</h1>
                <TodoListItemsComponent todos={this.props.todos.data} collection={this.props.collection} />
            </div>
        );
    }
});

module.exports = TodoListComponent;
