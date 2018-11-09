import assert from 'assert';
import * as connect from './HeepConnections';

var emptyState = {
    devices: {deviceArray: []},
    positions: {},
    controls: {controlStructure:{}},
    vertexList: {},
    icons: {},
    url: ''
  }

describe('HeepConnections.js', () => {
	describe('ResetMasterState', () => {
		it('Returns an empty masterState', () => {
		  	assert.deepEqual(emptyState, connect.ResetMasterState());
		});
	});

	describe('GetMasterState', () => {
		it('Returns masterState', () => {
			connect.ResetMasterState();
		  	assert.deepEqual(emptyState, connect.GetCurrentMasterState());
		});
	});

	describe('FindGateway', () => {
		it('Returns an array with 3 values', () => {
			var ip = connect.findGateway();
		  	assert.equal(3, ip.length);
		});
	});
});