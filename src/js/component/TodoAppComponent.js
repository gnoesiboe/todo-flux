var React = require('react'),
    moment = require('moment'),
    AddTodoComponent = require('./AddTodoComponent'),
    TodayComponent = require('./TodayComponent'),
    TomorrowComponent = require('./TomorrowComponent'),
    LaterComponent = require('./LaterComponent'),
    mousetrap = require('mousetrap');

var _selections = [
    'today',
    'tomorrow',
    'later'
];

var TodoAppComponent = React.createClass({

    componentDidMount: function () {
        mousetrap.bind('right', this.applyNextSelection.bind(this));
        mousetrap.bind('left', this.applyPreviousSelection.bind(this));
    },

    applyPreviousSelection: function () {
        this.setState({
            currentIndex: (this.state.currentIndex - 1) < 0 ? _selections.length - 1  : this.state.currentIndex - 1
        });
    },

    applyNextSelection: function () {
        this.setState({
            currentIndex: (this.state.currentIndex + 1) > (_selections.length - 1) ? 0 : this.state.currentIndex + 1
        });
    },

    /**
     * @returns {Object}
     */
    getInitialState: function () {
        return {
            currentIndex: 0
        }
    },

    /**
     * Renders this component into it's container element
     *
     * @returns {XML}
     */
    render: function () {
        var today = moment().format('YYYY-MM-DD'),
            selection = _selections[this.state.currentIndex];

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
                        <TodayComponent current={selection === 'today'} />
                    </div>
                    <div className="col-md-4">
                        <TomorrowComponent current={selection === 'tomorrow'} />
                    </div>
                    <div className="col-md-4">
                        <LaterComponent current={selection === 'later'} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TodoAppComponent;

