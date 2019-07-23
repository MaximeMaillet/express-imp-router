const express = require('express');
const app = express();
const router = require('express-imp-router');

router(app);
router.enableDebug();
router.route([
	{
	  controllers: 'useless',
		routes: {
			'/public': {
				[router.IMP.STATIC]: {
					targets: ['public', 'media'],
				}
			}
		}
	}
]);

app.listen(8080);
