var React = require('react'),
    moment = require('moment'),
    AddTodoComponent = require('./AddTodoComponent'),
    TodayComponent = require('./TodayComponent'),
    TomorrowComponent = require('./TomorrowComponent'),
    LaterComponent = require('./LaterComponent');

var TodoAppComponent = React.createClass({

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
                        <TodayComponent />
                    </div>
                    <div className="col-md-4">
                        <TomorrowComponent />
                    </div>
                    <div className="col-md-4">
                        <LaterComponent />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TodoAppComponent;

