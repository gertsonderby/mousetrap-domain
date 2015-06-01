/*global weknowhow, describe, afterEach, beforeEach, it, Mousetrap*/
var expect = weknowhow.expect.clone();

describe('domain-mousetrap', function () {
    afterEach(function () {
        Mousetrap.reset();
    });

    describe('bindDomain', function () {
        it('creates a binding based on domain', function (done) {
            var fired = false;
            Mousetrap.bindDomain('first', 'h', function () {
                fired = true;
            });
            Mousetrap.setDomain('first');
            Mousetrap.trigger('h');
            setTimeout(function () {
                expect(fired, 'to be true');
                done();
            }, 0);
        });
        it('binding does not fire when domain not selected', function (done) {
            var fired = false;
            Mousetrap.bindDomain('first', 'h', function () {
                fired = true;
            });
            Mousetrap.setDomain('notfirst');
            Mousetrap.trigger('h');
            setTimeout(function () {
                expect(fired, 'to be false');
                done();
            }, 0);
        });
        it('can bind an event to multiple domains', function (done) {
            var fired = false;
            Mousetrap.bindDomain(['first', 'second'], 'h', function () {
                fired = true;
            });
            Mousetrap.setDomain('first');
            Mousetrap.trigger('h');
            setTimeout(function () {
                expect(fired, 'to be true');
                fired = false;
                Mousetrap.setDomain('second');
                Mousetrap.trigger('h');
                setTimeout(function () {
                    expect(fired, 'to be true');
                    fired = false;
                    Mousetrap.setDomain('third');
                    Mousetrap.trigger('h');
                    setTimeout(function () {
                        expect(fired, 'to be false');
                        done();
                    }, 0);
                }, 0);
            }, 0);
        });
    });

    describe('unbindDomain', function () {
        var fired;
        beforeEach(function () {
            fired = false;
            Mousetrap.bindDomain('first', 'h', function () {
                fired = true;
            });
            Mousetrap.bindDomain('second', 'h', function () {
                fired = true;
            });
            Mousetrap.bindDomain(['first', 'second'], 'k', function () {
                fired = true;
            });
        });

        it('unbinds a domain-specific binding', function (done) {
            Mousetrap.unbindDomain('first', 'h');
            Mousetrap.setDomain('first');
            Mousetrap.trigger('h');
            setTimeout(function () {
                expect(fired, 'to be false');
                done();
            }, 0);
        });
        it('unbinds multiple domain-specific bindings', function (done) {
            Mousetrap.unbindDomain(['first', 'second'], ['h', 'k']);
            Mousetrap.setDomain('first');
            Mousetrap.trigger('h');
            Mousetrap.trigger('k');
            setTimeout(function () {
                expect(fired, 'to be false');
                Mousetrap.setDomain('second');
                Mousetrap.trigger('h');
                Mousetrap.trigger('k');
                setTimeout(function () {
                    expect(fired, 'to be false');
                    done();
                }, 0);
            }, 0);
        });
    });

    describe('reset', function () {
        var fired;
        beforeEach(function () {
            fired = false;
            Mousetrap.bindDomain('first', 'h', function () {
                fired = true;
            });
        });

        it('removes domain-specific bindings', function () {
            Mousetrap.reset();
            Mousetrap.setDomain('first');
            Mousetrap.trigger('h');
            setTimeout(function () {
                expect(fired, 'to be false');
            });
        });
        it('... even when domain is reintroduced', function () {
            Mousetrap.reset();
            Mousetrap.bindDomain('first', 'x', function () {
                fired = true;
            });
            Mousetrap.setDomain('first');
            Mousetrap.trigger('h');
            setTimeout(function () {
                expect(fired, 'to be false');
            });
        });
    });
});
