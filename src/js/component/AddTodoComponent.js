var React = require('react'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    moment = require('moment'),
    mousetrap = require('mousetrap');

var AddTodoComponent = React.createClass({

    /**
     * Gets called just after this component was mounted
     */
    componentDidMount: function () {
        mousetrap.bind(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], function () {
            this.focusTitleInput();
        }.bind(this));

        mousetrap.bind('escape', function () {
            this.blurInputs();
        }.bind(this));
    },

    /**
     * Puts focus on the title input of the add todo form
     */
    focusTitleInput: function () {
        if (this.refs.title) {
            React.findDOMNode(this.refs.title).focus();
        }
    },

    blurInputs: function () {
        console.log('blur inputs');

        if (this.refs.title) {
            React.findDOMNode(this.refs.title).blur();
        }

        if (this.refs.collection) {
            React.findDOMNode(this.refs.collection).blur();
        }

        if (this.refs.date) {
            React.findDOMNode(this.refs.date).blur();
        }
    },

    /**
     * Gets called when the form is submitted and handles todo
     * creation and prevents actual backend form submission
     *
     * @todo proper validation of input
     *
     * @param {Object} event
     */
    onFormSubmit: function (event) {
        event.preventDefault();

        if (this.state.title.length === 0) {
            return;
        }

        AppDispatcher.dispatch(ActionFactory.buildCreateAction(
            this.state.title,
            this.state.collection,
            this.state.date
        ));

        this.reset();
    },

    getInitialState: function () {
        return this.getDefaultState();
    },

    reset: function () {
        this.setState(this.getDefaultState());
    },

    getDefaultState: function () {
        return {
            title: this.props.title,
            collection: this.props.collection,
            date: this.props.date
        };
    },

    onFieldChange: function (event) {
        var state = {};

        state[event.target.name] = event.target.value;

        this.setState(state);
    },

    render: function () {
        return (
            <form className="form-inline" onSubmit={this.onFormSubmit}>
                <div className="form-group">
                    <input type="text"
                           className="form-control"
                           ref="title"
                           name="title"
                           placeholder="Title"
                           value={this.state.title}
                           onChange={this.onFieldChange}/>&nbsp;
                </div>
                <div className="form-group">
                    <select className="form-control"
                            ref="collection"
                            name="collection"
                            value={this.state.collection}
                            onChange={this.onFieldChange}>
                        <option value="today">today</option>
                        <option value="tomorrow">tomorrow</option>
                        <option value="later">later</option>
                    </select>&nbsp;
                </div>
                <div className="form-group">
                    <input type="date"
                           className="form-control"
                           ref="date"
                           name="date"
                           value={this.state.date}
                           onChange={this.onFieldChange} />&nbsp;
                </div>
                <button type="submit" className="btn btn-success">Add</button>
            </form>
        );
    }
});

module.exports = AddTodoComponent;
