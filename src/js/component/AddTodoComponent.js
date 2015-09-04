var React = require('react'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    moment = require('moment');

var AddTodoComponent = React.createClass({
    onFormSubmit: function (event) {
        event.preventDefault();

        if (this.refs.title.getDOMNode().value.length === 0) {
            return;
        }

        AppDispatcher.dispatch(ActionFactory.buildCreateAction(
            this.refs.title.getDOMNode().value,
            this.refs.collection.getDOMNode().value,
            this.refs.date.getDOMNode().value
        ));

        this.clearForm();
    },

    getInitialState: function () {
        return this.getDefaultState();
    },

    clearForm: function () {
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
                           onChange={this.onFieldChange} />&nbsp;
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
