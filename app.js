'use strict';

var ruffle = require('ruffle');
var _ = ruffle._;
var utils = ruffle._;

var ToggleButton = ruffle.component(
    withState,
    function () {
        this.attributes({
            id: null,
            active: ''
        });

        this.initialState({
            active: (this.attr.active ? '' : 'active')
        });

        this.on(this.node, 'click', function (e, data) {
            this.setState({
                active: (this.state.active ? '' : 'active')
            });
        });

        this.after('initialize', function () {
            this.after('setState', this.render);
            this.render();
        });

        this.render = function () {
            this.node.setAttribute('data-active', this.state.active);
        };
    }
);

var SuperToggleButton = ruffle.createClass(ToggleButton, {
    initialize: function () {
        console.log('initialized');
        console.log('this', this);
        console.log('this.props', this.props);
    },

    render: function () {
        this.node.textContent = (this.state.active ? 'Active!' : 'Not active');
    }
});

var components = {
    ToggleButton: ToggleButton,
    SuperToggleButton: SuperToggleButton
};

document.addEventListener('DOMContentLoaded', function () {
    [].slice.call(document.querySelectorAll('[data-component]')).forEach(function (elem) {
        components[elem.dataset.component] && components[elem.dataset.component](elem, elem.dataset);
    });
});


function withState() {

        /**
         * Define the component's initial state. Takes an object. Values
         * can be of any type; functions will be called at initialize time
         * to produce values that will be used as part of the component's
         * initial this.state value.
         *
         * Examples:
         *
         *      this.initialState({
         *          active: false,
         *          counter: 0,
         *          id: function () {
         *              return this.node.getAttribute('data-id');
         *          }
         *      });
         *
         * Warning: reference data types (objects, arrays, functions) will
         * be shared between instances of the component. Be careful.
         *
         * Multiple calls will be merged together, with the last overwriting
         * the first.
         */
        this.initialState = function (tx) {
            this._stateDef = utils.merge(this._stateDef || {}, tx);
        };

        /**
         * Change the component's state to a new value.
         *
         * Returns the new state.
         */
        this.setState = function (state) {
            if (!state) {
                return;
            }
            return (this.state = state);
        };

        /**
         * Merge an object of new state data onto the existing state. Takes
         * an object containing the changes.
         *
         * Merge is shallow (only merges based on top-level keys).
         *
         * Examples:
         *
         *      // this.state === { counter: 0, active: false }
         *
         *      this.mergeState({
         *          counter: this.state.counter + 1
         *      });
         *
         *      // this state === { counter: 1, active: false }
         *
         * Returns the new state.
         */
        this.mergeState = function (tx) {
            return this.setState(utils.merge(this.state, tx));
        };

        /**
         * Make a function that returns the piece of state specified by the
         * `key` passed.
         *
         * Examples:
         *
         *      var getActive = this.fromState('active');
         *      ...
         *      getActive(); // returns this.state.active
         *
         * Returns a function.
         */
        this.fromState = function (key) {
            return function () {
                return this.state[key];
            };
        };

        /**
         * Make a function that sets the state at `key` to the value it is
         * called with.
         *
         * Example:
         *
         *      var setActive = this.toState('active');
         *      ...
         *      setActive(false); // sets this.state.active to false
         *
         * Returns a fuction.
         */
        this.toState = function (key) {
            return function (data) {
                var tx = {};
                tx[key] = data;
                this.mergeState(tx);
            };
        };

        this.before('initialize', function () {
            var stateDef = (this._stateDef || {});
            var ctx = this;
            var state = Object.keys(stateDef).reduce(function (state, k) {
                var value = stateDef[k];
                state[k] = (typeof value === 'function' ? value.call(ctx) : value);
                return state;
            }, {});
            this.setState(state);
        });
    }
