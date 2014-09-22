var http = require("http"),
	zlib = require("zlib"),
	tar = require("tar"),
	url = require("url");

module.exports = function (loc, dest, callback) {
	"use strict";

	var parsed = url.parse(loc);
	parsed.headers = {"accept-encoding": "gzip,deflate"};

	http.get(parsed)
		.on("response", function (res) {
			var decodeFuncName = {
					gzip: "createGunzip",
					deflate: "createInflate"
				}[res.headers["content-encoding"]];
			(decodeFuncName ? res.pipe(zlib[decodeFuncName]()) : res).pipe(tar.Extract({path: dest}))
				.on("end", callback).on("error", callback);
		})
		.on("error", callback);
};
