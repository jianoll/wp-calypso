/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { geoLocation } from '../reducer';
import { DESERIALIZE, HAPPYCHAT_SET_GEO_LOCATION } from 'state/action-types';

describe( 'reducers', () => {
	describe( '#geoLocation()', () => {
		it( 'should default to null', () => {
			const state = geoLocation( undefined, {} );

			expect( state ).to.be.null;
		} );

		it( 'should set the current user geolocation', () => {
			const state = geoLocation( null, {
				type: HAPPYCHAT_SET_GEO_LOCATION,
				geoLocation: { city: 'Timisoara' },
			} );

			expect( state ).to.eql( { city: 'Timisoara' } );
		} );

		it( 'returns valid geolocation', () => {
			const state = geoLocation(
				{ city: 'Timisoara' },
				{
					type: DESERIALIZE,
				}
			);

			expect( state ).to.eql( { city: 'Timisoara' } );
		} );
	} );
} );
