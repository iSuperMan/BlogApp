import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme';
import App from './App'

describe('<App /> component', () => {
	
	it('render without exploding', () => {
		expect(
			shallow(<App />).length
		).to.equal(1);
	})
	
})