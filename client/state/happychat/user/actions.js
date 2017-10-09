/** @format **/
/**
 * Internal dependencies
 */
import { HAPPYCHAT_SET_GEO_LOCATION } from 'state/action-types';

/**
 * Returns an action object to be used in signalling that the current user geo location
 * has been set.
 *
 * @param  {Object} geoLocation Geo location information based on ip
 * @return {Object}        Action object
 */
export function setGeoLocation( geoLocation ) {
	return {
		type: HAPPYCHAT_SET_GEO_LOCATION,
		geoLocation,
	};
}
