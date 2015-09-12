var React = require('react'),
    todoTodayStore = require('./../store/TodoTodayStore'),
    TodoListComponent = require('./TodoListComponent');

var TodayComponent = React.createClass({

    /**
     * @returns {Object}
     *
     * @private
     */
    _getState: function () {
        return {
            todos: todoTodayStore.getAll()
        };
    },

    getInitialState: function () {
        return this._getState();
    },

    componentDidMount: function () {
        todoTodayStore.addChangeListener(this._onStoreChange);
    },

    componentWillUnmount: function () {
        todoTodayStore.removeChangeListener(this._onStoreChange);
    },

    _onStoreChange: function () {
        this.setState(this._getState());
    },

    render: function () {
        return (
            <TodoListComponent title="Today"
                               todos={this.state.todos}
                               current={this.props.current}
                               collection="today" />
        );
    }
});

module.exports = TodayComponent;
