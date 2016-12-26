var expect = require("chai").expect;
var sinon = require('sinon')
var Logger = require("../")


describe('Logger', function() {
	it('should create a global object', function() {
		Logger()
		expect(global).to.have.property('logger')
	})

	describe('global instance', function() {
		it('should have a log method', function() {
			expect(logger).to.have.property('log')
		})

		it('should have a debug method', function() {
			expect(logger).to.have.property('debug')
		})

		it('should have a info method', function() {
			expect(logger).to.have.property('info')
		})

		it('should have a warn method', function() {
			expect(logger).to.have.property('warn')
		})

		it('should have a error method', function() {
			expect(logger).to.have.property('error')
		})
	})
})