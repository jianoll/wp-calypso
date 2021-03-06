/** @format */
/**
 * External dependencies
 */
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { stub } from 'sinon';

/**
 * Internal dependencies
 */
import { NavigationLink } from '../';
import EMPTY_COMPONENT from 'components/empty-component';
import signupUtils from 'signup/utils';

jest.mock( 'lib/analytics', () => ( {
	tracks: {
		recordEvent: () => {},
	},
} ) );
jest.mock( 'lib/signup/actions', () => ( {
	submitSignupStep: require( 'sinon' ).stub(),
} ) );
jest.mock( 'signup/utils', () => ( {
	getStepUrl: require( 'sinon' ).stub(),
} ) );
jest.mock( 'gridicons', () => require( 'components/empty-component' ) );

describe( 'NavigationLink', () => {
	const Gridicon = EMPTY_COMPONENT;
	const defaultProps = {
		flowName: 'test:flow',
		stepName: 'test:step2',
		positionInFlow: 1,
		stepSectionName: 'test:section',
		signupProgress: [
			{ stepName: 'test:step1', stepSectionName: 'test:section1', wasSkipped: false },
			{ stepName: 'test:step2', stepSectionName: 'test:section2', wasSkipped: false },
			{ stepName: 'test:step3', stepSectionName: 'test:section3', wasSkipped: false },
		],
		goToNextStep: stub(),
		translate: str => `translated:${ str }`,
	};
	let props;

	beforeEach( () => {
		props = Object.assign( {}, defaultProps );
		props.goToNextStep = stub();
	} );

	afterEach( () => {
		signupUtils.getStepUrl.reset();
	} );

	it( 'should render Button element', () => {
		const wrapper = shallow( <NavigationLink { ...props } /> );

		expect( wrapper.find( 'Button' ) ).to.have.length( 1 );
		expect( wrapper.find( 'Button' ).props().className ).to.equal( 'navigation-link' );
	} );

	it( 'should render no icons when the direction prop is undefined', () => {
		const wrapper = shallow( <NavigationLink { ...props } /> );
		expect( wrapper.find( Gridicon ) ).to.not.exist;
	} );

	it( 'should render right-arrow icon when the direction prop is "forward".', () => {
		const wrapper = shallow( <NavigationLink { ...props } direction="forward" /> );

		expect( wrapper.find( Gridicon ) ).to.have.length( 1 );
		expect( wrapper.childAt( 1 ) ).to.have.prop( 'icon', 'arrow-right' );
		expect( wrapper.childAt( 0 ).text() ).to.equal( 'translated:Skip for now' );
	} );

	it( 'should render left-arrow icon when the direction prop is "back".', () => {
		const wrapper = shallow( <NavigationLink { ...props } direction="back" /> );

		expect( wrapper.find( Gridicon ) ).to.have.length( 1 );
		expect( wrapper.childAt( 0 ) ).to.have.prop( 'icon', 'arrow-left' );
		expect( wrapper.childAt( 1 ).text() ).to.equal( 'translated:Back' );
	} );

	it( 'should set href prop to undefined when the direction is not "back".', () => {
		const wrapper = shallow( <NavigationLink { ...props } direction="forward" /> );
		expect( wrapper.props().href ).to.equal( undefined );
	} );

	it( 'should set a proper url as href prop when the direction is "back".', () => {
		expect( signupUtils.getStepUrl ).not.to.be.called;

		const wrapper = shallow( <NavigationLink { ...props } direction="back" /> );

		// It should call signupUtils.getStepUrl()
		expect( signupUtils.getStepUrl ).to.has.been.called;
		expect( signupUtils.getStepUrl ).to.has.been.calledWith(
			'test:flow',
			'test:step1',
			'test:section1',
			'en'
		);

		// when it is the first step
		signupUtils.getStepUrl = stub();
		wrapper.setProps( { stepName: 'test:step1' } ); // set the first step
		expect( signupUtils.getStepUrl ).to.has.been.called;
		expect( signupUtils.getStepUrl ).to.has.been.calledWith( 'test:flow', null, '', 'en' );

		// The href should be backUrl when exist.
		wrapper.setProps( { backUrl: 'test:back-url' } );
		expect( wrapper.props().href ).to.equal( 'test:back-url' );
	} );

	it( 'should call goToNextStep() only when the direction is forward and clicked', () => {
		const wrapper = shallow( <NavigationLink { ...props } direction="forward" /> );

		expect( props.goToNextStep ).not.to.has.been.called;
		wrapper.simulate( 'click' );
		expect( props.goToNextStep ).to.has.been.called;
	} );

	it( 'should not call goToNextStep() when the direction is back', () => {
		const wrapper = shallow( <NavigationLink { ...props } direction="back" /> );

		expect( props.goToNextStep ).not.to.has.been.called;
		wrapper.simulate( 'click' );
		expect( props.goToNextStep ).not.to.has.been.called;
	} );
} );
