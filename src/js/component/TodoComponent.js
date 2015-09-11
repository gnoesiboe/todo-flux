var React = require('react'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    moment = require('moment');

var TodoComponent = React.createClass({

    /**
     * Gets called when the checkbox state is changed
     */
    handleOnCheckboxChange: function () {
        AppDispatcher.dispatch(ActionFactory.buildChangeCompleteStatusAction(this.props.todo));
    },

    /**
     * GEts called when the user tries to delete a
     */
    onDeleteClick: function () {
        var isConfirmed = confirm('Are you sure?');

        if (isConfirmed) {
            AppDispatcher.dispatch(ActionFactory.buildDeleteAction(this.props.todo));
        }
    },

    _formatDate: function (date) {
        var className = "text-muted";

        date = moment(date);

        var today = moment(),
            tomorrow = today.clone().add(1, 'days');

        // define value
        var value = null;
        if (date.isSame(today, 'day')) {
            value = 'today';
        } else if (date.isSame(tomorrow, 'day')) {
            value = 'tomorrow';
        } else {
            value = date.format('DD/MM');
        }

        var startOfDay = moment().startOf('day');

        // define color
        if (date.isBefore(startOfDay)) {
            className = 'alert-danger';
        }

        return <span className={className}>{value}</span>;
    },

    /**
     * Renders this component into it's parent element
     *
     * @returns {XML}
     */
    render: function () {
        return (
            <li className="list-group-item" ref="todo" data-id={this.props.todo.id}>
                <div className="js-todo checkbox">
                    <a href="#" className="pull-right" onClick={this.onDeleteClick}>x</a>
                    <label>
                        <input type="checkbox" refs="checkbox" checked={this.props.todo.isCompleted} onChange={this.handleOnCheckboxChange} />
                        {this._formatDate(this.props.todo.date)}&nbsp;-&nbsp;<strong>{this.props.todo.title}</strong>
                    </label>
                </div>
            </li>
        );
    }
});

module.exports = TodoComponent;
