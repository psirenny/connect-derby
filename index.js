var async = require('async');

module.exports = function (connect) {
  var ConnectStore = connect.Store || connect.session.Store;

  function DerbyStore(options) {
    ConnectStore.call(this, options);
    this.collection = options.collection || 'sessions';
    this.derbyStore = options.store;
    this.derbyModel = this.derbyStore.createModel();
  }

  DerbyStore.prototype.__proto__ = ConnectStore.prototype;

  DerbyStore.prototype.clear = function (callback) {
    var collection = this.collection;
    var derbyModel = this.derbyModel;
    var $sessions = derbyModel.query(collection, {});
    $sessions.fetch(function (err) {
      if (err) return callback(err);
      async.each($sessions.get(), function (session, callback) {
        var $session = derbyModel.at(collection + '.' + session.id);
        $session.fetch(function (err) {
          if (err) return callback(err);
          $session.del(callback);
        });
      }, callback);
    });
  };

  DerbyStore.prototype.del = function (sid, callback) {
    var $session = this.derbyModel.at(this.collection + '.' + sid);
    $session.fetch(function (err) {
      if (err) return callback(err);
      $session.del(callback);
    });
  };

  DerbyStore.prototype.get = function (sid, callback) {
    var $session = this.derbyModel.at(this.collection + '.' + sid);
    $session.fetch(function (err) {
      if (err) return callback(err);
      callback(null, $session.get());
    });
  };

  DerbyStore.prototype.length = function (callback) {
    var $count = this.derbyModel.query(this.collection, {$count: true});
    $count.fetch(function (err) {
      if (err) return callback(err);
      callback(null, $count.get().extra);
    });
  };

  DerbyStore.prototype.set = function (sid, session, callback) {
    var $session = this.derbyModel.at(this.collection + '.' + sid);
    $session.fetch(function (err) {
      if (err) return callback(err);
      $session.set('', session, callback);
    });
  };

  return DerbyStore;
};
