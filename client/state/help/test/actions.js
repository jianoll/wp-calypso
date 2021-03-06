/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { selectSiteId } from '../actions';
import { HELP_CONTACT_FORM_SITE_SELECT } from 'state/action-types';

describe( 'actions', () => {
	describe( '#selectSiteId()', () => {
		it( 'should return an action object', () => {
			const action = selectSiteId( 1 );

			expect( action ).to.eql( {
				type: HELP_CONTACT_FORM_SITE_SELECT,
				siteId: 1,
			} );
		} );
	} );
} );
