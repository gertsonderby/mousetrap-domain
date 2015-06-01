# Mousetrap-Domain

[![Build Status](https://travis-ci.org/gertsonderby/mousetrap-domain.svg?branch=master)](https://travis-ci.org/gertsonderby/mousetrap-domain)

This is an extension to [Mousetrap](http://craig.is/killing/mice).

If you have an application different view states, with key events that only occur in one, or keys which have different effects depending on which state the view is in, you may have had to write key handlers a little like this:

```JavaScript
Mousetrap.bind('d', function () {
    if (viewState === 'a_condition') {
        doThingsOneWay();
    } else {
        doThingsAnotherWay();
    }
});
```

The Mousetrap-domain extension allows you to set domain names, and to bind keys by domain:

```JavaScript
Mousetrap.bindDomain('first_domain', 'd', doThingsOneWay);

Mousetrap.bindDomain('second_domain', 'd', doThingsAnotherWay);

// In event handlers or other view handling code:
Mousetrap.setDomain('second_domain');
```

Mousetrap will, then, keep track of the domain you've set it to and will only activate the events that are bound to that domain, or events that are global. This is useful for a one-page application that needs to switch between key combo sets, applications with complex markup that may need key handling in a set of elements not accomodated by the built-in element handling of Mousetrap, or any other situation where you have a situations that call for distinct sets of key handlers. Support for normal, global `bind()` is retained, although you should avoid using `bind()` and `bindDomain()` with the same key combination.

## API

##### `Mousetrap.bindDomain(domainName, keyComboOrSequence, handler)`

Binds `handler` to be executed when `keyComboOrSequence` is entered - but only if `domainName` is the currently set domain. In every other way, it is exactly like `Mousetrap.bind()`. Both `domainName` and `keyComboOrSequence` may be passed as arrays containing domain names/key combinations as with the `Mousetrap.bind()`.

##### `Mousetrap.unbindDomain(domainName, keyComboOrSequence)`

Unbinds the handler for `keyComboOrSequence` on `domainName`, without affecting any others.

##### `Mousetrap.setDomain(domainName)`

Sets the currently active domain name. A domain name may be any string. If there are events bound to that domain name, they will be activated.

##### `Mousetrap.reset()`

Useful for testing, this function wraps the original Mousetrap reset function to clear any domains entered, and reset the internal values used for domain tracking.
