/** @format */
// These CONNECTION_ERROR constants come directly from the Socket.IO client library.
// These are the possible reasons for a connection disconnect.
export const HAPPYCHAT_CONNECTION_ERROR_FORCED_CLOSE = 'forced close';
export const HAPPYCHAT_CONNECTION_ERROR_PING_TIMEOUT = 'ping timeout';
export const HAPPYCHAT_CONNECTION_ERROR_TRANSPORT_CLOSE = 'transport close';
export const HAPPYCHAT_CONNECTION_ERROR_TRANSPORT_ERROR = 'transport error';

// Max number of messages to save between refreshes
export const HAPPYCHAT_MAX_STORED_MESSAGES = 30;

// Groups
export const HAPPYCHAT_GROUP_JPOP = 'jpop';
export const HAPPYCHAT_GROUP_WOO = 'woo';
export const HAPPYCHAT_GROUP_JPPHP = 'jpphp';
export const HAPPYCHAT_GROUP_WPCOM = 'WP.com';

// Message types
export const HAPPYCHAT_MESSAGE_TYPES = {
	CUSTOMER_EVENT: 'customer-event',
	CUSTOMER_INFO: 'customer-info',
	LOG: 'log',
};

// Chat status
export const HAPPYCHAT_CHAT_STATUS_ABANDONED = 'abandoned';
export const HAPPYCHAT_CHAT_STATUS_ASSIGNED = 'assigned';
export const HAPPYCHAT_CHAT_STATUS_ASSIGNING = 'assigning';
export const HAPPYCHAT_CHAT_STATUS_BLOCKED = 'blocked';
export const HAPPYCHAT_CHAT_STATUS_CLOSED = 'closed';
export const HAPPYCHAT_CHAT_STATUS_DEFAULT = 'default';
export const HAPPYCHAT_CHAT_STATUS_NEW = 'new';
export const HAPPYCHAT_CHAT_STATUS_MISSED = 'missed';
export const HAPPYCHAT_CHAT_STATUS_PENDING = 'pending';
