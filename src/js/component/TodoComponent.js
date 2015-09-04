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

    /**
     * Renders this component into it's parent element
     *
     * @returns {XML}
     */
    render: function () {
        var dataFormatted = moment(this.props.todo.date).format('MM/DD');

        return (
            <li className="list-group-item">
                <div className="js-todo checkbox">
                    <a href="#" className="pull-right" onClick={this.onDeleteClick}>x</a>
                    <label>
                        <input type="checkbox" refs="checkbox" checked={this.props.todo.isCompleted} onChange={this.handleOnCheckboxChange} />
                        <span className="text-muted">[{dataFormatted}]</span>&nbsp;-&nbsp;<strong>{this.props.todo.title}</strong>
                    </label>
                </div>
            </li>
        );
    }
});

module.exports = TodoComponent;
