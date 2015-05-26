define([
    'mousetrap'
], function (Mousetrap) {
    var currentDomain = null;
    var domainCallbacks = {};

    var oldReset = Mousetrap.reset;
    Mousetrap.reset = function () {
        currentDomain = null;
        domainCallbacks = {};
        oldReset.apply(Mousetrap);
    };

    Mousetrap.setDomain = function (name) {
        currentDomain = name;
    };

    function domainKeyHandler(key) {
        return function (event, combo) {
            // Check current domain for handler
            if (currentDomain && domainCallbacks[currentDomain] && domainCallbacks[currentDomain][key]) {
                return domainCallbacks[currentDomain][key](event, combo);
            }
        };
    }

    function keyUnused(key) {
        return Object.keys(domainCallbacks).every(function (domain) {
            return !domainCallbacks[domain][key];
        });
    }

    Mousetrap.bindDomain = function (domains, keys, handlerFunc) {
        if (typeof domains === 'string') {
            domains = [domains];
        }
        if (typeof keys === 'string') {
            keys = [keys];
        }
        keys.forEach(function (key) {
            if (keyUnused(key)) {
                Mousetrap.bind(key, domainKeyHandler(key));
            }
        });
        domains.forEach(function (domain) {
            if (!domainCallbacks[domain]) {
                domainCallbacks[domain] = {};
            }
            keys.forEach(function (key) {
                domainCallbacks[domain][key] = handlerFunc;
            });
        });
    };

    Mousetrap.unbindDomain = function (domains, keys) {
        if (typeof domains === 'string') {
            domains = [domains];
        }
        if (typeof keys === 'string') {
            keys = [keys];
        }
        domains.forEach(function (domain) {
            keys.forEach(function (key) {
                delete domainCallbacks[domain][key];
            });
            if (Object.keys(domainCallbacks[domain]).length === 0) {
                delete domainCallbacks[domain];
            }
        });
        keys.forEach(function (key) {
            if (keyUnused(key)) {
                Mousetrap.unbind(key);
            }
        });
    };

    return Mousetrap;
});
