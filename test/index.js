var connect = require('connect')
  , derby = require('derby')
  , DerbyStore = require('..')(connect)
  , liveDbMongo = require('livedb-mongo')
  , mongoClient = liveDbMongo((process.env.MONGO_HOSTNAME || 'localhost') + ':' + (process.env.MONGO_PORT || 27017) + '/' + (process.env.MONGO_DB || 'test') + '?auto_reconnect', {safe: true})
  , redis = require('redis')
  , redisClient = redis.createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_HOSTNAME || '127.0.0.1', {auth_pass: process.env.REDIS_PASSWORD | ''})
  , should = require('chai').should();

redisClient.select(process.env.REDIS_INDEX || 0);
var derbyStore = derby.createStore({db: {db: mongoClient, redis: redisClient}});

describe('connect-derby', function () {
  it('should be a function', function () {
    DerbyStore.should.be.a('function');
  });

  describe('store', function () {
    var derbyModel = derbyStore.createModel();
    var store = new DerbyStore({store: derbyStore});

    it('should be an instance of DerbyStore', function () {
      store.should.be.an.instanceof(DerbyStore);
    });

    it('should have a "clear" property', function () {
      store.should.have.property('set');
    });

    it('should have a "del" property', function () {
      store.should.have.property('set');
    });

    it('should have a "get" property', function () {
      store.should.have.property('set');
    });

    it('should have a "length" property', function () {
      store.should.have.property('set');
    });

    it('should have a "set" property', function () {
      store.should.have.property('set');
    });

    it('should clear session', function (done) {
      var sid = 'length-sid';
      var session = {foo: 'bar', id: sid};
      var $session = derbyModel.at('sessions.' + sid);
      $session.fetch(function (err) {
        if (err) return done(err);
        $session.set('', session, function () {
          store.clear(function (err) {
            if (err) return done(err);
            var $count = derbyModel.query('sessions', {$count: true});
            $count.fetch(function (err) {
              if (err) return done(err);
              $count.get().extra.should.equal(0);
              done();
            });
          });
        });
      });
    });

    it('should delete session data', function (done) {
      var sid = 'del-sid';
      var session = {foo: 'bar', id: sid};
      var $session = derbyModel.at('sessions.' + sid);
      $session.fetch(function (err) {
        if (err) return done(err);
        $session.set('', session, function () {
          store.del(sid, function (err) {
            if (err) return done(err);
            $session.fetch(function (err) {
              if (err) return done(err);
              should.equal($session.get(), undefined);
              done();
            });
          });
        });
      });
    });

    it('should get session data', function (done) {
      var sid = 'get-sid';
      var $session = derbyModel.at('sessions.' + sid);
      $session.fetch(function (err) {
        if (err) return done(err);
        $session.set('', {foo: 'bar', id: sid}, function () {
          store.get(sid, function (err, session) {
            if (err) return done(err);
            $session.get().should.eql(session);
            done();
          });
        });
      });
    });

    it('should set session data', function (done) {
      var sid = 'set-sid';
      var session = {foo: 'bar', id: sid};
      store.set(sid, session, function (err) {
        if (err) return done(err);
        var $session = derbyModel.at('sessions.' + sid);
        $session.fetch(function (err) {
          if (err) return done(err);
          $session.get().should.eql(session);
          done();
        });
      });
    });

    it('should get session length', function (done) {
      var sid = 'length-sid';
      var session = {foo: 'bar', id: sid};
      var $session = derbyModel.at('sessions.' + sid);
      $session.fetch(function (err) {
        if (err) return done(err);
        $session.set('', session, function () {
          store.length(function (err, len) {
            if (err) return done(err);
            var $count = derbyModel.query('sessions', {$count: true});
            $count.fetch(function (err) {
              if (err) return done(err);
              $count.get().extra.should.equal(len);
              done();
            });
          });
        });
      });
    });
  });
});
