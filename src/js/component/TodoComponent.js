var React = require('react'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    moment = require('moment'),
    modusConstants = require('./../constants/ModusConstants'),
    ActionConstants = require('./../constants/ActionConstants'),
    sweetalert = require('sweetalert');

var TodoComponent = React.createClass({

    /**
     * @returns {Object}
     */
    getInitialState: function () {
        return this.getDefaultState();
    },

    componentDidMount: function () {
        AppDispatcher.register(function (action) {
            switch (action.type) {
                case ActionConstants.TODO_ENTER_EDIT_MODE:
                    this.enterEditModeIfIsCurrentTodo();
                    break;

                case ActionConstants.TODO_DELETE_CURRENTLY_SELECTED:
                    this.initiateDeleteIfCurrentTodo();
                    break;

                default:
                    // do nothing, action not relevant for this component
                    break;
            }
        }.bind(this));
    },

    enterEditModeIfIsCurrentTodo: function () {
        if (!this.props.current) {
            return;
        }

        this.setState({
            modus: modusConstants.EDIT
        }, function () {
            this.focusTitleInput();
        });
    },

    initiateDeleteIfCurrentTodo: function () {
        if (!this.props.current) {
            return;
        }

        this.initiateDelete();
    },

    /**
     * @returns {Object}
     */
    getDefaultState: function () {
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
    onDeleteClick: function (event) {
        event.preventDefault();

        this.initiateDelete();
    },

    initiateDelete: function () {
        sweetalert({
            title: 'Are you sure?',
            text: 'Are you sure you want to delete this todo? You will not be able to recover it.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!'
        }, this.onTodoDeleteConfirmed);
    },

    onTodoDeleteConfirmed: function () {
        AppDispatcher.dispatch(ActionFactory.buildDeleteAction(this.props.todo));
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
        }, function () {
            this.focusTitleInput();
        });
    },

    focusTitleInput: function () {
        if (this.refs.title) {
            React.findDOMNode(this.refs.title).focus();
        }
    },

    /**
     * @param {Object} event
     */
    onFormSubmit: function (event) {
        event.preventDefault();

        if (this.refs.title.getDOMNode().value.length === 0) {
            return;
        }

        AppDispatcher.dispatch(ActionFactory.buildEditAction(
            this.props.todo.id,
            this.state.title,
            this.state.date
        ));

        this.reset();
    },

    /**
     * Resets the state of this component
     */
    reset: function () {
        this.setState(this.getDefaultState());
    },

    /**
     * @param {Object} event
     */
    onFieldChange: function (event) {
        var state = {};
        state[event.target.name] = event.target.value;

        this.setState(state);
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
                               onChange={this.onFieldChange}
                               placeholder="title"/>&nbsp;
                    </div>
                    <div className="form-group">
                        <input type="date"
                               className="form-control"
                               ref="date"
                               value={this.state.date}
                               onChange={this.onFieldChange}
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
                    <li><a href="#" onClick={this.onEditClick}><i className="glyphicon glyphicon-edit"></i></a></li>
                    <li><a href="#" onClick={this.onDeleteClick}><i className="glyphicon glyphicon-remove"></i></a></li>
                </ul>

                <label>
                    <input type="checkbox" refs="checkbox" checked={this.props.todo.isCompleted}
                           onChange={this.handleOnCheckboxChange}/>
                    <div>
                        <div>
                            <strong>{this.props.todo.title}</strong>
                        </div>
                        <div>
                            Due: {this._formatDate(this.props.todo.date)}
                        </div>
                    </div>
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

            case modusConstants.VIEW:
                inner = this.renderModusView();
                break;

            default:
                throw new Error('Modus \'' + this.state.modus + '\' not supported');
        }

        var className = 'list-group-item todo indent-' + this.props.todo.indentation +
            (this.props.current ? ' current' : '') +
            (this.props.todo.isCompleted ? ' completed' : '');

        return (
            <li className={className} ref="todo" data-id={this.props.todo.id}>
                <div className="js-todo">
                    {inner}
                </div>
            </li>
        );
    }
});

module.exports = TodoComponent;
