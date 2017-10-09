/** @format **/
/**
 * Internal dependencies
 */
import {
	HAPPYCHAT_BLUR,
	HAPPYCHAT_FOCUS,
	HAPPYCHAT_SET_CHAT_STATUS,
	HAPPYCHAT_SET_GEO_LOCATION,
} from 'state/action-types';

export const setHappychatChatStatus = status => ( {
	type: HAPPYCHAT_SET_CHAT_STATUS,
	status,
} );

export const blur = () => ( { type: HAPPYCHAT_BLUR } );
export const focus = () => ( { type: HAPPYCHAT_FOCUS } );

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
