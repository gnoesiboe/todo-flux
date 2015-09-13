var React = require('react'),
    todoTomorrowStore = require('./../store/TodoTomorrowStore'),
    TodoListComponent = require('./TodoListComponent');

var TomorrowComponent = React.createClass({

    /**
     * @returns {Object}
     *
     * @private
     */
    _getState: function () {
        return {
            todos: todoTomorrowStore.getAll()
        };
    },

    getInitialState: function () {
        return this._getState();
    },

    componentDidMount: function () {
        todoTomorrowStore.addChangeListener(this._onStoreChange);
    },

    componentWillUnmount: function () {
        todoTomorrowStore.removeChangeListener(this._onStoreChange);
    },

    _onStoreChange: function () {
        this.setState(this._getState());
    },

    render: function () {
        return (
            <TodoListComponent title="Tomorrow"
                               todos={this.state.todos}
                               isCurrentCollection={this.props.isCurrentCollection}
                               currentTodoIndex={this.props.currentTodoIndex}
                               collection="tomorrow" />
        );
    }
});

module.exports = TomorrowComponent;
