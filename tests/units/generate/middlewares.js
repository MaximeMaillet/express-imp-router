const { expect } = require('chai');
const generator = require('../../../src/generator/generator')
const router = require('../../../index');
const middlewareClassPath = `${__dirname}/../data/middlewares/`;

describe('Generate middlewares', () => {
	function itResultFormat(result) {
		it('should be an array of object with length of 1', () => {
			expect(result).to.be.an('array').that.have.lengthOf(1);
			expect(result[0]).to.an('object');
		});
	}

	function itRequiredFields(result) {
		it('should have required fields', () => {
			expect(result[0].method).to.equal(router.METHOD.ALL);
			expect(result[0].route).to.equal('/string');
			expect(result[0].controllers).to.an('array');
		});
	}

	describe('without errors', () => {
		const routes = [
			{
				route: '/string',
				generated: false,
				level: router.MIDDLEWARE.LEVEL.APP,
				inheritance: router.MIDDLEWARE.INHERITANCE.NONE,
				method: router.METHOD.ALL,
				status: 0,
				controllers: [
					{
						debug: {},
						route: '/string',
						method: 'get',
						controller: 'middle',
						action: 'get',
						classPath: middlewareClassPath,
						status: 0
					}
				],
			}
		];

		const result = generator.generate(routes);

		itResultFormat(result);

		itRequiredFields(result);

		it('should have generated to true', () => {
			expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
			expect(result[0].controllers[0].generated).to.be.true;
			expect(result[0].controllers[0].status).to.equal(0);
		});
	});

	describe('with errors', () => {

		describe('without middleware file', () => {
			const routes = [
				{
					route: '/string',
					generated: false,
					level: router.MIDDLEWARE.LEVEL.APP,
					inheritance: router.MIDDLEWARE.INHERITANCE.NONE,
					method: router.METHOD.ALL,
					status: 0,
					controllers: [
						{
							debug: {},
							route: '/string',
							method: 'get',
							controller: 'noExistFile',
							action: 'get',
							classPath: middlewareClassPath,
							status: 0
						}
					],
				}
			];

			const result = generator.generate(routes);

			itResultFormat(result);

			itRequiredFields(result);

			it('should have "generated" to true', () => {
				expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
				expect(result[0].controllers[0].generated).to.be.false;
				expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.CONTROLLER_FAILED).to.equal(router.ERRORS.CONTROLLER.CONTROLLER_FAILED);
			});
		});

		describe('without no action', () => {
			const routes = [
				{
					route: '/string',
					generated: false,
					level: 'app',
					inheritance: 'none',
					method: router.METHOD.ALL,
					status: 0,
					controllers: [
						{
							debug: {},
							route: '/string',
							method: 'get',
							controller: 'middle',
							action: 'unknown',
							classPath: middlewareClassPath,
							status: 0
						}
					],
				}
			];

			const result = generator.generate(routes);

			itResultFormat(result);

			itRequiredFields(result);

			it('should have "generated" to true', () => {
				expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
				expect(result[0].controllers[0].generated).to.be.false;
				expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.ACTION_FAILED).to.equal(router.ERRORS.CONTROLLER.ACTION_FAILED);
			});
		});
	});
});
