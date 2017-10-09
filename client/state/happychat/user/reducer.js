/**
 * Internal dependencies
 */
import {
	HAPPYCHAT_SET_GEO_LOCATION,
} from 'state/action-types';
import { combineReducers, createReducer } from 'state/utils';
import { geoLocationSchema } from './schema';

/**
 * Tracks the current user geo location.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const geoLocation = createReducer(
	null,
	{
		[ HAPPYCHAT_SET_GEO_LOCATION ]: ( state, action ) => action.geoLocation,
	},
	geoLocationSchema
);

export default combineReducers( {
	geoLocation,
} );
