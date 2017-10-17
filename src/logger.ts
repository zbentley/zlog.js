'use strict';

const pino = require('pino'),
      pkginfo = require('pkginfo')(module),
      inspect = require('eyes').inspector({ stream: null }),
      _ = require('lodash');

class Logger {
	constructor(name = module.exports.name, debug = true) {
		const pretty = debug ? pino.pretty({
			formatter: inspect,
			levelFirst: true,
			forceColor: true
		}) : null;

		pretty.pipe(process.stdout);
		this.pino = pino({
			name: name,
			level: debug ? "debug" : "info"
		}, pretty);
		this.delegateLevels(this);
	}

	delegateLevels(obj) {
		obj = obj || this;
		_.forEach(require('pino/lib/levels').levels, ({}, key, {}) => {
			if (_.has(obj, key)) {
				throw new Exception(`'${key}' is already a property of '${obj}'; cannot delegate`);
			} else {
				_.set(obj, key, _.bindKey(this.pino, key));
			}
		});
	}
}

module.exports = Logger;
//# sourceMappingURL=logger.js.map
