import assert from 'assert';
import * as parser from './HAPIMemoryParser';


describe('HeepMemoryParser', () => {
	describe('ReadHeepResponse', () => {
		it('Should Read an empty success ROP', () => {
			var buffer = Buffer.from([0x10, 0x01, 0x02, 0x03, 0x04, 0x00]);
			var expectedResult = {
				op: 16, 
				deviceID: 16909060, 
				packetBytes: 0,
				success: true,
				message: ''
			}
			assert.deepEqual(expectedResult, parser.ReadHeepResponse(buffer))
		})
		it('Should Read a success ROP with a message', () => {
			var buffer = Buffer.from([0x10, 0x01, 0x02, 0x03, 0x04, 0x04, 0x48, 0x45, 0x45, 0x50]);
			var expectedResult = {
				op: 16, 
				deviceID: 16909060, 
				packetBytes: 4,
				success: true,
				message: 'HEEP'
			}
			assert.deepEqual(expectedResult, parser.ReadHeepResponse(buffer))
		})
		it('Should Read an error ROP with a message', () => {
			var buffer = Buffer.from([0x11, 0x01, 0x02, 0x03, 0x04, 0x04, 0x48, 0x45, 0x45, 0x50]);
			var expectedResult = {
				op: 17, 
				deviceID: 16909060, 
				packetBytes: 4,
				success: false,
				message: 'HEEP'
			}
			assert.deepEqual(expectedResult, parser.ReadHeepResponse(buffer))
		})
		it('Should Read an empty error ROP', () => {
			var buffer = Buffer.from([0x11, 0x01, 0x02, 0x03, 0x04, 0x00]);
			var expectedResult = {
				op: 17, 
				deviceID: 16909060, 
				packetBytes: 0,
				success: false,
				message: ''
			}
			assert.deepEqual(expectedResult, parser.ReadHeepResponse(buffer))
		})
	})
	describe('MemoryCrawler', () => {
		it('Should return array of Heep objects', () => {
			var buffer = Buffer.from([0x01, 0x01, 0x02, 0x03, 0x04, 0x01, 0x01, 0x02, 0x01, 0x02, 0x03, 0x04, 0x09, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x44, 0x4D, 0x44]);
			var expectedResult = [
			{
				op: 1,
			    deviceID: 16909060,
			    packetBytes: 1,
			    version: 1
			}, 
			{
				op: 2,
			    deviceID: 16909060,
			    packetBytes: 9,
			    control: {
				    ControlID: 2,
				    ControlValueType: 3,
				    ControlDirection: 4,
				    LowValue: 5,
				    HighValue: 6,
				    CurCtrlValue: 7,
				    ControlName: 'DMD'
				  }
			}];
			
		  	assert.deepEqual(expectedResult, parser.MemoryCrawler(buffer));
		});
		it('Should return array of Heep objects', () => {
			var buffer = Buffer.from([0x01, 0x01, 0x02, 0x03, 0x04, 0x01, 0x01, 0x02, 0x01, 0x02, 0x03, 0x04, 0x09, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x44, 0x4D, 0x44]);
			var expectedResult = [
			{
				op: 1,
			    deviceID: 16909060,
			    packetBytes: 1,
			    version: 1
			}, 
			{
				op: 2,
			    deviceID: 16909060,
			    packetBytes: 9,
			    control: {
				    ControlID: 2,
				    ControlValueType: 3,
				    ControlDirection: 4,
				    HighValue: 6,
				    LowValue: 5,
				    CurCtrlValue: 7,
				    ControlName: 'DMD'
				  }
			}];
			
		  	assert.deepEqual(expectedResult, parser.MemoryCrawler(buffer));
		});
	});
	describe('ReadFirmwareVersion', () => {
		it('Should return version', () => {
			var buffer = Buffer.from([0x01, 0x02]);
		  	assert.equal(2, parser.ReadFirmwareVersion(buffer));
		});
	});
	describe('ReadDeviceID', () => {
		it('Should Return the correct ID from 4 input bytes', () => {
			var buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
			var it = 0;
		  	assert.equal(16909060, parser.ReadDeviceID(buffer, it));
		});
	});
	describe('ReadControl', () => {
		var buffer = Buffer.from([0x03, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x44, 0x4D, 0x44]);

		var control = parser.ReadControl(buffer);
		
		it('Returns correct ControlID', () => {
		  	assert.equal(2, control.ControlID);
		});
		it('Returns correct ControlValueType', () => {
		  	assert.equal(3, control.ControlValueType);
		});
		it('Returns correct ControlDirection', () => {
		  	assert.equal(4, control.ControlDirection);
		});
		it('Returns correct LowValue', () => {
		  	assert.equal(5, control.LowValue);
		});
		it('Returns correct HighValue', () => {
		  	assert.equal(6, control.HighValue);
		});
		it('Returns correct CurCtrlValue', () => {
		  	assert.equal(7, control.CurCtrlValue);
		});
		it('Returns correct ControlName', () => {
		  	assert.equal('DMD', control.ControlName);
		});

	});
	describe('ReadPosition', () => {
		it('Should Return the correct Position from 4 input bytes', () => {
			var buffer = Buffer.from([0x04, 0x01, 0x02, 0x03, 0x04]);
			var expectedResult = {left: 258, top: 772};
		  	assert.deepEqual(expectedResult, parser.ReadPosition(buffer));
		});
	});

	describe('ReadDeviceName', () => {
		it('Should Return the correct Name', () => {
			var buffer = Buffer.from([0x04, 0x74, 0x65, 0x73, 0x74]);
		  	assert.equal('test', parser.ReadDeviceName(buffer));
		});
	});

	describe('ReadIconID', () => {
		it('Should Return an icon name when passed a single byte', () => {
			var buffer = Buffer.from([0x01, 0x01]);
		  	assert.equal('light-bulb', parser.ReadIconID(buffer));
		});
	});

	describe('ReadVertex', () => {
		it('Should Return a Vertex Object when passed byte Array', () => {
			// Number of Bytes	Rx Device ID 1 	Rx Device ID 2	Rx Device ID 3	Rx Device ID 4	Tx Control ID	Rx Control ID	Rx IP1	Rx IP2	Rx IP3	Rx IP4
			var buffer = Buffer.from([0x0A, 0x01, 0x02, 0x03, 0x04, 0x01, 0x02, 0xC0, 0xA8, 0x01, 0xC8])
			var expectedResult = {
				rxDeviceID: 16909060,
				txControlID: 1,
				rxControlID: 2, 
				rxIP: '192.168.1.200'
			}

			assert.deepEqual(expectedResult, parser.ReadVertex(buffer));
		});
	});


});