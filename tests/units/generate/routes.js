const { expect } = require('chai');
const routeGenerator = require('../../../src/generator/generator')
const router = require('../../../index');
const controllersPath = `${__dirname}/../data/controllers/`;

describe('Generate routes', () => {
	function itResultFormat(result) {
		it('should be an array of object with length of 1', () => {
			expect(result).to.be.an('array').that.have.lengthOf(1);
			expect(result[0]).to.an('object');
		});
	}

	function itRequiredFields(result) {
		it('should have required fields', () => {
			expect(result[0].method).to.equal('get');
			expect(result[0].route).to.equal('/string');
			expect(result[0].controllers).to.an('array');
		});
	}

	describe('with good routes', () => {
		const routes = [
			{
				route: '/string',
				method: 'get',
				status: 0,
				controllers: [
					{
						debug: {},
						route: '/string',
						method: 'get',
						controller: 'HomeController',
						action: 'home',
						classPath: controllersPath,
						status: 0
					}
				],
				debug: { controller: 'HomeController', action: 'home' }
			},
		];

		const result = routeGenerator.generate(routes);

		itResultFormat(result);

		itRequiredFields(result);

		it('should have 1 controller with "generated" to true', () => {
			expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
			expect(result[0].controllers[0].generated).to.be.true;
		});
	});

	describe('with uncorrect action', () => {
		const routes = [
			{
				route: '/string',
				method: 'get',
				status: 0,
				controllers: [
					{
						debug: {},
						route: '/string',
						method: 'get',
						controller: 'HomeController',
						action: 'home2',
						classPath: `${__dirname}/../data/controllers/`,
						status: 0
					}
				],
				debug: { controller: 'HomeController', action: 'home' }
			},
		];

		const result = routeGenerator.generate(routes);

		itResultFormat(result);

		itRequiredFields(result);

		it('should have "generated" to false and status different to 0', () => {
			expect(result[0].controllers[0].generated).to.be.false;
			expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.ACTION_FAILED).to.equal(router.ERRORS.CONTROLLER.ACTION_FAILED);
		});
	});

	describe('with no action', () => {
		const routes = [
			{
				route: '/string',
				method: 'get',
				status: 0,
				controllers: [
					{
						debug: {},
						route: '/string',
						method: 'get',
						controller: 'HomeController',
						// action: '',
						classPath: `${__dirname}/../data/controllers/`,
						status: 0
					}
				],
				debug: { controller: 'HomeController', action: 'home' }
			},
		];

		const result = routeGenerator.generate(routes);

		itResultFormat(result);

		itRequiredFields(result);

		it('should have "generated" to false and status different to 0', () => {
			expect(result[0].controllers[0].generated).to.be.false;
			expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.ACTION_FAILED).to.equal(router.ERRORS.CONTROLLER.ACTION_FAILED);
		});
	});

	describe('with uncorrect controller', () => {
		const routes = [
			{
				route: '/string',
				method: 'get',
				status: 0,
				controllers: [
					{
						debug: {},
						route: '/string',
						method: 'get',
						controller: 'InexistantController',
						// action: '',
						classPath: `${__dirname}/../data/controllers/`,
						status: 0
					}
				],
				debug: { controller: 'HomeController', action: 'home' }
			},
		];

		const result = routeGenerator.generate(routes);

		itResultFormat(result);

		itRequiredFields(result);

		it('should have "generated" to false and status different to 0', () => {
			const result = routeGenerator.generate(routes);
			expect(result[0].controllers[0].generated).to.be.false;
			expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.CONTROLLER_FAILED).to.equal(router.ERRORS.CONTROLLER.CONTROLLER_FAILED);
		});
	});

	describe('with no controller', () => {
		const routes = [
			{
				route: '/string',
				method: 'get',
				status: 0,
				controllers: [
					{
						debug: {},
						route: '/string',
						method: 'get',
						// controller: 'HomeController',
						// action: '',
						classPath: `${__dirname}/../data/controllers/`,
						status: 0
					}
				],
				debug: { controller: 'HomeController', action: 'home' }
			},
		];

		const result = routeGenerator.generate(routes);

		itResultFormat(result);

		itRequiredFields(result);

		it('should have "generated" to false and status different to 0', () => {
			const result = routeGenerator.generate(routes);
			expect(result[0].controllers[0].generated).to.be.false;
			expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.CONTROLLER_FAILED).to.equal(router.ERRORS.CONTROLLER.CONTROLLER_FAILED);
		});
	});
});
