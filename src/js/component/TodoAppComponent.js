var React = require('react'),
    moment = require('moment'),
    AddTodoComponent = require('./AddTodoComponent'),
    TodayComponent = require('./TodayComponent'),
    TomorrowComponent = require('./TomorrowComponent'),
    LaterComponent = require('./LaterComponent'),
    mousetrap = require('mousetrap'),
    todoStore = require('./../store/TodoStore'),
    AppDispatcher = require('./../dispatcher/AppDispatcher'),
    ActionFactory = require('./../action/ActionFactory'),
    ActionConstants = require('./../constants/ActionConstants'),
    sweetalert = require('sweetalert');

var _selections = [
    'today',
    'tomorrow',
    'later'
];

var TodoAppComponent = React.createClass({

    componentDidMount: function () {
        mousetrap.bind('right', this.applyNextCollectionSelected);
        mousetrap.bind('left', this.applyPreviousCollectionSelected);
        mousetrap.bind('up', this.applyPreviousTodoSelected);
        mousetrap.bind('down', this.applyNextTodoSelected);
        mousetrap.bind('space', this.onSpaceKeyPressed);
        mousetrap.bind('e', this.onEditKeyPressed);
        mousetrap.bind('d', this.onDeleteKeyPressed);
        mousetrap.bind('?', this.showPopupWithKeyboardShortcuts);
        mousetrap.bind('tab', this.onIndentInitiated);
        mousetrap.bind('shift+tab', this.onUnindentInitiated);

        AppDispatcher.register(function (action) {
            switch (action.type) {
                case ActionConstants.TODO_CREATE:
                    this.handleTodoCreateAction(action);
                    break;

                default:
                    // do nothing as this action is not interesting for this component
                    break;
            }
        }.bind(this));
    },

    /**
     * @param {Object} event
     */
    onUnindentInitiated: function (event) {
        event.preventDefault();

        AppDispatcher.dispatch(ActionFactory.buildTodoUnindentAction(
            _selections[this.state.currentSelectionIndex],
            this.state.currentTodoIndex
        ));
    },

    /**
     * @param {Object} event
     */
    onIndentInitiated: function (event) {
        event.preventDefault();

        AppDispatcher.dispatch(ActionFactory.buildTodoIndentAction(
            _selections[this.state.currentSelectionIndex],
            this.state.currentTodoIndex
        ));
    },

    showPopupWithKeyboardShortcuts: function () {
        sweetalert({
            title: 'Keyboard shorcuts',
            text: '<strong>a</strong> / <strong>c</strong>: create new todo<br />' +
            '<strong>left</strong> / <strong>right</strong> / <strong>up</strong> / <strong>down</strong>: navigate through existing todos<br />' +
            '<strong>d</strong>: delete currently selected todo<br />' +
            '<strong>e</strong>: edit the currently selected todo<br />' +
            '<strong>space</strong>: toggle complete status of currently selected todo<br />' +
            '<strong>tab</strong>: indent todo<br />' +
            '<strong>shift + tab</strong>: un-indent todo',

            html: true
        });
    },

    /**
     * @param {Object} event
     */
    onDeleteKeyPressed: function (event) {
        event.preventDefault();

        AppDispatcher.dispatch(ActionFactory.buildDeleteCurrentTodoAction())
    },

    /**
     * @param {Object} event
     */
    onEditKeyPressed: function (event) {
        event.preventDefault();

        AppDispatcher.dispatch(ActionFactory.buildEnterTodoEditModeAction());
    },

    /**
     * @param {Object} event
     */
    onSpaceKeyPressed: function (event) {
        event.preventDefault();

        var currentTodo = todoStore.get(_selections[this.state.currentSelectionIndex]).getAll().getAtIndex(this.state.currentTodoIndex);

        AppDispatcher.dispatch(ActionFactory.buildChangeCompleteStatusAction(currentTodo));
    },

    applyPreviousTodoSelected: function (event) {
        event.preventDefault();

        var currentCollectionCount = todoStore.get(_selections[this.state.currentSelectionIndex]).count();

        this.setState({
            currentTodoIndex: (this.state.currentTodoIndex - 1) < 0 ? currentCollectionCount -1 : this.state.currentTodoIndex - 1
        });
    },

    applyNextTodoSelected: function (event) {
        event.preventDefault();

        var currentCollectionCount = todoStore.get(_selections[this.state.currentSelectionIndex]).count();

        this.setState({
            currentTodoIndex: (this.state.currentTodoIndex + 1) > (currentCollectionCount - 1) ? 0 : this.state.currentTodoIndex + 1
        });
    },

    applyPreviousCollectionSelected: function () {
        var newCollectionIndex = (this.state.currentSelectionIndex - 1) < 0 ? _selections.length - 1 : this.state.currentSelectionIndex - 1,
            newCollection = _selections[newCollectionIndex],
            targetCollectionCount = todoStore.get(newCollection).count();

        this.setState({
            currentSelectionIndex: newCollectionIndex,
            currentTodoIndex: targetCollectionCount - 1 < this.state.currentTodoIndex ? targetCollectionCount - 1 : this.state.currentTodoIndex
        });

        AppDispatcher.dispatch(ActionFactory.buildCollectionSelectAction(newCollection));
    },

    applyNextCollectionSelected: function () {
        var newCollectionIndex = (this.state.currentSelectionIndex + 1) > (_selections.length - 1) ? 0 : this.state.currentSelectionIndex + 1,
            newCollection = _selections[newCollectionIndex],
            targetCollectionCount = todoStore.get(newCollection).count();

        this.setState({
            currentSelectionIndex: newCollectionIndex,
            currentTodoIndex: targetCollectionCount - 1 < this.state.currentTodoIndex ? targetCollectionCount - 1 : this.state.currentTodoIndex
        });

        AppDispatcher.dispatch(ActionFactory.buildCollectionSelectAction(newCollection));
    },

    /**
     * @param {Object} action
     */
    handleTodoCreateAction: function (action) {
        var selectionIndex = _selections.indexOf(action.collection);

        if (selectionIndex === -1) {
            return;
        }

        var index = action.index === null ? todoStore.get(action.collection).count() - 1 : action.index;

        this.setState({
            currentSelectionIndex: selectionIndex,
            currentTodoIndex: index
        });
    },

    /**
     * @returns {Object}
     */
    getInitialState: function () {
        return {
            currentSelectionIndex: 0,
            currentTodoIndex: 0
        }
    },

    /**
     * Renders this component into it's container element
     *
     * @returns {XML}
     */
    render: function () {
        var today = moment().format('YYYY-MM-DD'),
            selection = _selections[this.state.currentSelectionIndex];

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
                        <TodayComponent isCurrentCollection={selection === 'today'} currentTodoIndex={this.state.currentTodoIndex} />
                    </div>
                    <div className="col-md-4">
                        <TomorrowComponent isCurrentCollection={selection === 'tomorrow'} currentTodoIndex={this.state.currentTodoIndex} />
                    </div>
                    <div className="col-md-4">
                        <LaterComponent isCurrentCollection={selection === 'later'} currentTodoIndex={this.state.currentTodoIndex} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TodoAppComponent;

