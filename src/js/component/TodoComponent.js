var React = require('react'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    moment = require('moment'),
    modusConstants = require('./../constants/ModusConstants');

var TodoComponent = React.createClass({

    /**
     * @returns {Object}
     */
    getInitialState: function () {
        return {
            title: this.props.todo.title,
            date: this.props.todo.date,
            modus: modusConstants.VIEW
        };
    },

    /**
     * Gets called when the checkbox state is changed
     */
    handleOnCheckboxChange: function () {
        AppDispatcher.dispatch(ActionFactory.buildChangeCompleteStatusAction(this.props.todo));
    },

    /**
     * Gets called when the user tries to delete a
     */
    onDeleteClick: function () {
        var isConfirmed = confirm('Are you sure?');

        if (isConfirmed) {
            AppDispatcher.dispatch(ActionFactory.buildDeleteAction(this.props.todo));
        }
    },

    /**
     * @param {String} date
     *
     * @returns {XML}
     *
     * @private
     */
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
     * @param {Object} event
     */
    onEditClick: function (event) {
        event.preventDefault();

        this.setState({
            modus: modusConstants.EDIT
        });
    },

    /**
     * @returns {XML}
     */
    renderModusEdit: function () {
        return (
            <div>
                <form className="form-inline" onSubmit={this.onFormSubmit}>
                    <div className="form-group">
                        <input className="form-control"
                               type="text"
                               ref="title"
                               name="title"
                               value={this.state.title}
                               placeholder="title"/>&nbsp;
                    </div>
                    <div className="form-group">
                        <input type="date"
                               className="form-control"
                               ref="date"
                               value={this.state.date}
                               name="date"/>&nbsp;
                    </div>
                    <button type="submit" className="btn btn-success">Save</button>
                </form>
            </div>
        )
    },

    /**
     * @returns {XML}
     */
    renderModusView: function () {
        return (
            <div className="checkbox">
                <ul className="list-inline pull-right">
                    <li><a href="#" onClick={this.onEditClick}>e</a></li>
                    <li><a href="#" onClick={this.onDeleteClick}>x</a></li>
                </ul>

                <label>
                    <input type="checkbox" refs="checkbox" checked={this.props.todo.isCompleted}
                           onChange={this.handleOnCheckboxChange}/>
                    {this._formatDate(this.props.todo.date)}&nbsp;-&nbsp;
                    <strong>{this.props.todo.title}</strong>
                </label>
            </div>
        )
    },

    /**
     * Renders this component into it's parent element
     *
     * @returns {XML}
     */
    render: function () {
        var inner = null;

        switch (this.state.modus) {
            case modusConstants.EDIT:
                inner = this.renderModusEdit();
                break;

            default:
                inner = this.renderModusView();
                break;
        }

        return (
            <li className="list-group-item" ref="todo" data-id={this.props.todo.id}>
                <div className="js-todo">
                    {inner}
                </div>
            </li>
        );
    }
});

module.exports = TodoComponent;
