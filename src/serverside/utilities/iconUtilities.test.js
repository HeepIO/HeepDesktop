import assert from 'assert';
import * as iconUtils from './iconUtilities';


describe('HeepIconUtils', () => {
	
	describe('getDefaultIcons', () => {
		it('Returns an array', () => {
		  	assert.equal(true, Array.isArray(iconUtils.getDefaultIcons()));
		});

		it('Return array contains strings', () => {
			var result = iconUtils.getDefaultIcons()
		  	assert.equal("string", typeof result[0]);
		});
	});

	describe('generateIconKeywords', () => {
		it('Returns with one input', () => {
			var expectedResult = {light: 'light'};
			var input = ['light'];
			assert.equal(JSON.stringify(expectedResult), JSON.stringify(iconUtils.generateIconKeywords(input)))
		})
		it('Returns with two inputs', () => {
			var expectedResult = {light: 'light', bulb: 'bulb'};
			var input = ['light', 'bulb'];
			assert.equal(JSON.stringify(expectedResult), JSON.stringify(iconUtils.generateIconKeywords(input)))
		})
		it('Returns with dashed inputs', () => {
			var expectedResult = {light: 'light-bulb', bulb: 'light-bulb'};
			var input = ['light-bulb'];
			assert.equal(JSON.stringify(expectedResult), JSON.stringify(iconUtils.generateIconKeywords(input)))
		})
	})

	describe('suggestIconForDevice', () => {
		it('Suggests a new icon', () => {
			assert.equal('light-bulb', iconUtils.suggestIconForDevice('Bulby'))
		})
		it('Suggests none when no match', () => {
			assert.equal('none', iconUtils.suggestIconForDevice('asdfawverve'))
		})
	})
});