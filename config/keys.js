// determine environment
if (process.env.NODE_ENV === 'production') {
	//  we are in prod env, return prod set of keys
	module.exports = require('./prod');
} else {
	//  in dev env, return dev keys
	module.exports = require('./dev');
}
