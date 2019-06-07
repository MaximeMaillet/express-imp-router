const express = require('express');
const app = express();
const router = require('../../index');

router(app);
router.enableDebug();
router.route([
	{
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
