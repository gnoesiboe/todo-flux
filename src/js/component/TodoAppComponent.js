var React = require('react'),
    TodoListComponent = require('./TodoListComponent'),
    TodoStore = require('./../store/TodoStore'),
    moment = require('moment'),
    AddTodoComponent = require('./AddTodoComponent');

var _getState = function () {
    var allTodos = TodoStore.getAll();

    var today = moment();

    return {
        todosToday: allTodos.filter(function (todo) {
            return todo.collection === 'today';
        }),
        todosTomorrow: allTodos.filter(function (todo) {
            return todo.collection === 'tomorrow';
        }),
        todosLater: allTodos.filter(function (todo) {
            return todo.collection === 'later';
        })
    };
};

var TodoAppComponent = React.createClass({

    getInitialState: function () {
        return _getState();
    },

    componentDidMount: function () {
        TodoStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        TodoStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(_getState());
    },

    /**
     * Renders this component into it's container element
     *
     * @returns {XML}
     */
    render: function () {
        var today = moment().format('YYYY-MM-DD');

        return (
            <div className="container">
                <hr />
                <div className="row">
                    <div className="col-md-12 text-center">
                        <AddTodoComponent date={today} collection="today" title="" />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-4">
                        <TodoListComponent title="Today" todos={this.state.todosToday}/>
                    </div>
                    <div className="col-md-4">
                        <TodoListComponent title="Tomorrow" todos={this.state.todosTomorrow}/>
                    </div>
                    <div className="col-md-4">
                        <TodoListComponent title="Later" todos={this.state.todosLater}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TodoAppComponent;

