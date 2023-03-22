const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line


var _myData = {}

require('./routes/sort-code/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/f1/routes.js')(router,JSON.parse(JSON.stringify(_myData)));


module.exports = router