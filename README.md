connect-derby
=============

Derby session store for Connect.  
[![Build Status](https://travis-ci.org/psirenny/connect-derby.png?branch=master)](https://travis-ci.org/psirenny/connect-derby)

Installation
------------

    $ npm install connect-derby

Usage
-----

    var express = require('express')
    var DerbyStore = require('connect-derby')(express);

    ...

    var store = derby.createStore({
      db: {db: mongo, redis: redis}
    });

    ...

    app.use(express.session({
      secret: 'APP SECRET',
      store: new DerbyStore({store: store})
    }))

Options
-------

 - `collection` Collection (optional, default: `sessions`)
