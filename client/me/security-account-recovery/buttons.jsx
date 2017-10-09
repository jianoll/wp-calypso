/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import React from 'react';

/**
 * Internal dependencies
 */
import FormButtonsBar from 'components/forms/form-buttons-bar';
import FormButton from 'components/forms/form-button';
import Gridicon from 'gridicons';

export default React.createClass( {
	displayName: 'SecurityAccountRecoveryManageContactButtons',

	propTypes: {
		isSavable: PropTypes.bool,
		isDeletable: PropTypes.bool,
		saveText: PropTypes.string,
		onSave: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
		onDelete: PropTypes.func.isRequired,
	},

	render: function() {
		return (
			<FormButtonsBar>
				<FormButton disabled={ ! this.props.isSavable } onClick={ this.props.onSave }>
					{ this.props.saveText ? this.props.saveText : this.translate( 'Save' ) }
				</FormButton>

				<FormButton isPrimary={ false } onClick={ this.props.onCancel }>
					{ this.translate( 'Cancel' ) }
				</FormButton>

				{ this.props.isDeletable ? (
					<button
						className={ 'security-account-recovery-contact__remove' }
						onClick={ this.props.onDelete }
					>
						<Gridicon icon="trash" size={ 24 } />
						<span>{ this.translate( 'Remove' ) }</span>
					</button>
				) : null }
			</FormButtonsBar>
		);
	},
} );
