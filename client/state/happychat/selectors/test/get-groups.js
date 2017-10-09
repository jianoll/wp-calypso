/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { HAPPYCHAT_GROUP_WPCOM, HAPPYCHAT_GROUP_JPOP } from 'state/happychat/constants';
import getGroups from '../get-groups';
import { isEnabled } from 'config';
import { PLAN_BUSINESS } from 'lib/plans/constants';
import { userState } from 'state/selectors/test/fixtures/user-state';

describe( '#getGroups()', () => {
	let _window; // Keep a copy of the original window if any
	const uiState = {
		ui: {
			section: {
				name: 'reader',
			},
		},
	};

	beforeEach( () => {
		_window = global.window;
		global.window = {};
	} );

	afterEach( () => {
		global.window = _window;
	} );

	it( 'should return default group for no sites', () => {
		const siteId = 1;
		const state = {
			...uiState,
			...userState,
			sites: {
				items: {},
			},
		};

		expect( getGroups( state, siteId ) ).to.eql( [ HAPPYCHAT_GROUP_WPCOM ] );
	} );

	it( 'should return default group for no siteId', () => {
		const siteId = undefined;
		const state = {
			...uiState,
			...userState,
			sites: {
				items: {
					1: {},
				},
			},
		};

		expect( getGroups( state, siteId ) ).to.eql( [ HAPPYCHAT_GROUP_WPCOM ] );
	} );

	it( 'should return JPOP group for jetpack paid sites', () => {
		const siteId = 1;
		const state = {
			...uiState,
			...userState,
			currentUser: {
				id: 1,
				capabilities: {
					[ siteId ]: {
						manage_options: true,
					},
				},
			},
			sites: {
				items: {
					[ siteId ]: {
						jetpack: true,
						plan: {
							product_id: 2005,
							product_slug: 'jetpack_personal',
						},
					},
				},
			},
		};

		expect( getGroups( state, siteId ) ).to.eql( [ HAPPYCHAT_GROUP_JPOP ] );
	} );

	it( 'should return WPCOM for AT sites group for jetpack site', () => {
		const siteId = 1;
		const state = {
			...uiState,
			...userState,
			currentUser: {
				id: 1,
				capabilities: {
					[ siteId ]: {
						manage_options: true,
					},
				},
			},
			sites: {
				items: {
					[ siteId ]: {
						jetpack: true,
						options: { is_automated_transfer: true },
						plan: { product_slug: PLAN_BUSINESS },
					},
				},
			},
		};

		expect( getGroups( state, siteId ) ).to.eql( [ HAPPYCHAT_GROUP_WPCOM ] );
	} );

	if ( isEnabled( 'jetpack/happychat' ) ) {
		it( 'should return JPOP group if within the jetpackConnect section', () => {
			const state = {
				...userState,
				sites: {
					items: {
						1: {},
					},
				},
				ui: {
					section: {
						name: 'jetpackConnect',
					},
				},
			};

			expect( getGroups( state ) ).to.eql( [ HAPPYCHAT_GROUP_JPOP ] );
		} );
	} else {
		it.skip( 'should not return JPOP group if within the jetpackConnect section' );
	}
} );
