var thinger = flight.compose(
    flight.base,
    flight.wrap(function () {
        this.on(document, 'thinger', function (e, data) {
            console.log(data);
        });

        this.after('initialize', function () {
            console.log('after initialize', this);
            this.trigger(this.node, 'thinger', { hello: 'world' });
        });
    })
);


var thinger = flight.compose(
    flight.base,
    flight.wrap(function ($) {
        this.attributes({
            b: 20
        });

        this.on(document, 'thinger', function (e, data) {
            console.log(data);
        });

        this.after('initialize', function () {
            console.log('this.attrs', this.attrs);
            this.trigger($.node, 'thinger', { hello: 'world' });
        });
    })
);
