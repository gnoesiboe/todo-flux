var React = require('react'),
    TodoListItemsComponent = require('./TodoListItemsComponent');

var TodoListComponent = React.createClass({

    render: function () {
        var className = 'js-todo-list todo-list-component' + (this.props.isCurrentCollection ? ' current' : '');

        // providing this.props.todos.data to make sure the sortable functionality work. It uses Array.slice, and this
        // cannot be used on our collection

        return (
            <div className={className}>
                <h1>{this.props.title}</h1>
                <TodoListItemsComponent todos={this.props.todos.data}
                                        collection={this.props.collection}
                                        isCurrentCollection={this.props.isCurrentCollection}
                                        currentTodoIndex={this.props.currentTodoIndex} />
            </div>
        );
    }
});

module.exports = TodoListComponent;
