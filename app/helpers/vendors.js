const request = require('request');
const cheerio = require('cheerio');
const vendorsUri = 'https://wherethefuckisxur.com/data.json';

class Vendors {

	getXurInventory(errorCallback, callback) {
		request({
			json: true,
			uri: vendorsUri,
		}, function(err, res, body) {
			if(err) {
				console.log(err);
				errorCallback(err);
			}
			else {
				callback(body.xur);
			}
		});
	}

	getXurLocation(errorCallback, callback) {
		const uri = 'https://wherethefuckisxur.com/';
		request({
			json: false,
			uri: uri,
		}, function(err, res, body) {
			if(err) {
				console.log(err);
				errorCallback(err);
			}
			else {
				const $ = cheerio.load(body);
				const location = $('#xur').children('h1').text();
				callback(location);
			}
		});
	}

	getActiveNightfalls(errorCallback, callback) {
		request({
			json: true,
			uri: vendorsUri,
		}, function(err, res, body) {
			if(err) {
				console.log(err);
				errorCallback(err);
			}
			else {
				callback(body.activenightfalls);
			}
		});
	}

	getSpidersInventory(errorCallback, callback) {
		request({
			json: true,
			uri: vendorsUri,
		}, function(err, res, body) {
			if(err) {
				console.log(err);
				errorCallback(err);
			}
			else {
				callback(body.spiderinventory);
			}
		});
	}

	getBansheesInventory(errorCallback, callback) {
		request({
			json: true,
			uri: vendorsUri,
		}, function(err, res, body) {
			if(err) {
				console.log(err);
				errorCallback(err);
			}
			else {
				callback(body.bansheeinventory);
			}
		});
	}

	getAdasInventory(errorCallback, callback) {
		request({
			json: true,
			uri: vendorsUri,
		}, function(err, res, body) {
			if(err) {
				console.log(err);
				errorCallback(err);
			}
			else {
				callback(body.adainventory);
			}
		});
	}
}

module.exports = Vendors;
