import assert from 'assert'
import * as generalUtils from './generalUtilities'

describe('generalUtils', () => {
	describe('nameVertex', () => {
		it('Names a Vertex with numeric IDs', () => {
			var vertex = {
			    txDeviceID: 1, 
			    rxDeviceID: 2,
			    txControlID: 3,
			    rxControlID: 4, 
			    rxIP: '10.0.0.1'
			  };

			assert.equal('1.3->2.4', generalUtils.nameVertex(vertex));
		})
	})
	describe('nameControl', () => {
		it('Names a Control', () => {
			assert.equal('1234.5', generalUtils.nameControl(1234, 5));
		})
	})

	describe('getTxControlNameFromVertex', () => {
		it('Pulls Tx out of a vertex Object', () => {
			var vertex = {
			    txDeviceID: 1, 
			    rxDeviceID: 2,
			    txControlID: 3,
			    rxControlID: 4, 
			    rxIP: '10.0.0.1'
			  };

			assert.equal('1.3', generalUtils.getTxControlNameFromVertex(vertex));
		})
	})

	describe('getRxControlNameFromVertex', () => {
		it('Pulls Rx out of a vertex Object', () => {
			var vertex = {
			    txDeviceID: 1, 
			    rxDeviceID: 2,
			    txControlID: 3,
			    rxControlID: 4, 
			    rxIP: '10.0.0.1'
			  };

			assert.equal('2.4', generalUtils.getRxControlNameFromVertex(vertex));
		})
	})

	describe('joinAddress', () => {
		it('Joins an array that represents an IP address', () => {
			assert.equal('192.168.1.1', generalUtils.joinAddress([192, 168, 1], 1));
		})
	})


})