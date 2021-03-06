var midware = require('../lib/midware.js')
	, redisService = require('../lib/redis')
	, db = require('../lib/db.js');

module.exports = function(app){
	/**
	 * Spec 4.1 HTTP DELETE for vehicle
	 */
	app.del('/api/vehicles/:id', function(req, res, next) {
		var id = req.params.id;
		db.remove('user', {'_id': mongojs.ObjectId(id)}, true, function(err, numberOfRemovedDocs) {
			if (!err) {
				res.json(true);
			} else {
				console.log(err);
				res.json(false);
			}
		});
	});

	/**
	 * Spec b4.1 Add vehicle via http.post()
	 */
	app.post('/api/vehicles', function(req, res){
		//console.log('lookup user.email=%j',reply);
		var vehicle = req.body;
		vehicle.email = res.locals.email;
		
		db.save('vehicle', vehicle, function(err, insertedDoc){
			if(!err) {
				return res.send(200, insertedDoc);
			} else {
				return res.send(500, {message:'DB Error when save vehicle'});
			}
		});
	});
	
	/**
	 * Spec b4.2 GET the vehicles
	 */
	app.get('/api/vehicles', function(req, res) {
		// order by 'firstname' with aescendant. 
		var sort = [['name', 1]];
		var email = res.locals.email;
		db.find('vehicle',{query:{'email': email}, sort:sort,limit:20}, function(err, vehicles) {
			if (!err) {
				return res.send(200,vehicles);
			} else {
				console.log(err);
				return res.send(500, {message:'DB Error when pull vehicles'});
			}
		});
	});
	
	/**
	 * Spec b4.3 Add mileages via http.post()
	 */
	app.post('/api/mileages/:vid', function(req, res) {
		var mileage = req.body;
		mileage.vid = req.params.vid;
		//console.log('[server] http.post(mileage)');
		//res.render('mileage/new', {title: "Mileages"});
		db.save('mileage', mileage, function(err, insertedUser){
			if(!err) {
				return res.send(200, mileage);
			} else {
				console.log(err);
				return res.send(500, {message:'DB Error when writing vehicle mileages'});
			}
		});
	});
	
	/**
	 * Spec b4.4 list top 20 mileages of a vehicle via http.get()
	 */
	app.get('/api/mileages/:vid', function(req, res) {
		//console.log('[server] http.get(mileage)');
		var vid = req.params.vid;
		var sort = [['date', 1]];
		db.find('mileage',{query:{'vid':vid}, sort:sort,limit:20}, function(err, mileages) {
			if (!err) {
				//console.log('mileages=>%j', mileages);
				return res.send(200,mileages);
			} else {
				console.log(err);
				return res.send(500, {message:'DB Error when list vehicle mileages'});
			}
		});
	});
};