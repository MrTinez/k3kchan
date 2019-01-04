const request = require('request');
const cheerio = require('cheerio');
const vendorsUri = 'https://wherethefuckisxur.com/data.json';

class Vendors {

	getXurInventory(errorCallback, callback) {
		try {
			request({
				json: true,
				uri: vendorsUri,
			}, (err, res, body) => {
				if (err) {
					console.log(err);
					errorCallback(err);
				}
				else {
					callback(body.xur);
				}
			});
		} catch (err) {
			console.log(err);
			errorCallback(err);
		}
	}

	getXurLocation(errorCallback, callback) {
		const uri = 'https://wherethefuckisxur.com/';
		try {
			request({
				json: false,
				uri: uri,
			}, (err, res, body) => {
				if (err) {
					console.log(err);
					errorCallback(err);
				}
				else {
					try {
						const $ = cheerio.load(body);
						const location = $('#xur').children('h1').text();
						callback(location);
					} catch (error) {
						console.log(error)
					}
				}
			});
		} catch (err) {
			console.log(err);
			errorCallback(err);
		}
	}

	getActiveNightfalls(errorCallback, callback) {
		try {
			request({
				json: true,
				uri: vendorsUri,
			}, (err, res, body) => {
				if (err) {
					console.log(err);
					errorCallback(err);
				}
				else {
					callback(body.activenightfalls);
				}
			});
		} catch (err) {
			console.log(err);
			errorCallback(err);
		}
	}

	getSpidersInventory(errorCallback, callback) {
		try {
			request({
				json: true,
				uri: vendorsUri,
			}, (err, res, body) => {
				if (err) {
					console.log(err);
					errorCallback(err);
				}
				else {
					callback(body.spiderinventory);
				}
			});
		} catch (err) {
			console.log(err);
			errorCallback(err);
		}
	}

	getBansheesInventory(errorCallback, callback) {
		try {
			request({
				json: true,
				uri: vendorsUri,
			}, (err, res, body) => {
				if (err) {
					console.log(err);
					errorCallback(err);
				}
				else {
					callback(body.bansheeinventory);
				}
			});
		} catch (err) {
			console.log(err);
			errorCallback(err);
		}
	}

	getAdasInventory(errorCallback, callback) {
		try {
			request({
				json: true,
				uri: vendorsUri,
			}, (err, res, body) => {
				if (err) {
					console.log(err);
					errorCallback(err);
				}
				else {
					callback(body.adainventory);
				}
			});
		} catch (err) {
			console.log(err);
			errorCallback(err);
		}
	}
}

module.exports = Vendors;
