var React = require('react'),
    todoLasterStore = require('./../store/TodoLaterStore'),
    TodoListComponent = require('./TodoListComponent');

var LaterComponent = React.createClass({

    /**
     * @returns {Object}
     *
     * @private
     */
    _getState: function () {
        return {
            todos: todoLasterStore.getAll()
        };
    },

    getInitialState: function () {
        return this._getState();
    },

    componentDidMount: function () {
        todoLasterStore.addChangeListener(this._onStoreChange);
    },

    componentWillUnmount: function () {
        todoLasterStore.removeChangeListener(this._onStoreChange);
    },

    _onStoreChange: function () {
        this.setState(this._getState());
    },

    render: function () {
        return (
            <TodoListComponent title="Later"
                               todos={this.state.todos}
                               current={this.props.current}
                               currentTodoIndex={this.props.currentTodoIndex}
                               collection="later" />
        );
    }
});

module.exports = LaterComponent;
