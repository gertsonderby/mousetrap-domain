(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['mousetrap'], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.Mousetrap);
    }
}(this, function (Mousetrap) {
    var _currentDomain = null;
    var _domainCallbacks = {};

    var _oldReset = Mousetrap.prototype.reset;
    Mousetrap.prototype.reset = function () {
        _currentDomain = null;
        _domainCallbacks = {};
        _oldReset.apply(this, arguments);
    };

    Mousetrap.prototype.setDomain = function (name) {
        _currentDomain = name;
    };

    function _domainKeyHandler(key) {
        return function (event, combo) {
            // Check current domain for handler
            if (_currentDomain && _domainCallbacks[_currentDomain] && _domainCallbacks[_currentDomain][key]) {
                return _domainCallbacks[_currentDomain][key](event, combo);
            }
        };
    }

    function _keyUnused(key) {
        return Object.keys(_domainCallbacks).every(function (domain) {
            return !_domainCallbacks[domain][key];
        });
    }

    Mousetrap.prototype.bindDomain = function (domains, keys, handlerFunc) {
        var that = this;
        if (typeof domains === 'string') {
            domains = [domains];
        }
        if (typeof keys === 'string') {
            keys = [keys];
        }
        keys.forEach(function (key) {
            if (_keyUnused(key)) {
                that.bind(key, _domainKeyHandler(key));
            }
        });
        domains.forEach(function (domain) {
            if (!_domainCallbacks[domain]) {
                _domainCallbacks[domain] = {};
            }
            keys.forEach(function (key) {
                _domainCallbacks[domain][key] = handlerFunc;
            });
        });
    };

    Mousetrap.prototype.unbindDomain = function (domains, keys) {
        var that = this;
        if (typeof domains === 'string') {
            domains = [domains];
        }
        if (typeof keys === 'string') {
            keys = [keys];
        }
        domains.forEach(function (domain) {
            keys.forEach(function (key) {
                delete _domainCallbacks[domain][key];
            });
            if (Object.keys(_domainCallbacks[domain]).length === 0) {
                delete _domainCallbacks[domain];
            }
        });
        keys.forEach(function (key) {
            if (_keyUnused(key)) {
                that.unbind(key);
            }
        });
    };

    Mousetrap.init();

    return Mousetrap;
}));
