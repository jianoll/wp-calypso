/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import emailValidator from 'email-validator';

/**
 * Internal dependencies
 */
import FormFieldset from 'components/forms/form-fieldset';
import FormTextInput from 'components/forms/form-text-input';
import FormInputValidation from 'components/forms/form-input-validation';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import Buttons from './buttons';

module.exports = React.createClass( {
	displayName: 'SecurityAccountRecoveryRecoveryEmailEdit',

	mixins: [ LinkedStateMixin ],

	propTypes: {
		storedEmail: PropTypes.string,
		onSave: PropTypes.func,
		onCancel: PropTypes.func,
		onDelete: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			storedEmail: null,
		};
	},

	getInitialState: function() {
		return {
			email: this.props.storedEmail || null,
		};
	},

	componentDidMount: function() {
		this.focusInput();
	},

	renderValidation: function() {
		var validation = null;
		if ( this.state.validation ) {
			validation = <FormInputValidation isError text={ this.state.validation } />;
		}
		return validation;
	},

	renderExplanation: function() {
		var explanation = null,
			text;

		if ( this.props.primaryEmail ) {
			text = this.translate( 'Your primary email address is {{email/}}', {
				components: {
					email: <strong>{ this.props.primaryEmail }</strong>,
				},
			} );

			explanation = <FormSettingExplanation>{ text }</FormSettingExplanation>;
		}
		return explanation;
	},

	render: function() {
		return (
			<div className={ this.props.className }>
				<FormFieldset>
					<FormTextInput
						valueLink={ this.linkState( 'email' ) }
						isError={ this.state.isInvalid }
						onKeyUp={ this.onKeyUp }
						name="recovery-email"
						ref="email"
					/>

					{ this.renderValidation() }
					{ this.renderExplanation() }
				</FormFieldset>

				<Buttons
					isSavable={ this.isSavable() }
					isDeletable={ !! this.props.storedEmail }
					saveText={ this.translate( 'Save Email' ) }
					onSave={ this.onSave }
					onDelete={ this.onDelete }
					onCancel={ this.onCancel }
				/>
			</div>
		);
	},

	focusInput: function() {
		ReactDom.findDOMNode( this.refs.email ).focus();
	},

	isSavable: function() {
		if ( ! this.state.email ) {
			return false;
		}

		if ( this.state.email === this.props.storedEmail ) {
			return false;
		}

		return true;
	},

	onKeyUp: function( event ) {
		if ( event.key === 'Enter' ) {
			this.onSave();
		}
	},

	onSave: function() {
		var email = this.state.email;

		if ( ! this.isSavable() ) {
			return;
		}

		if ( this.props.primaryEmail && email === this.props.primaryEmail ) {
			this.setState( {
				validation: this.translate(
					'You have entered your primary email address. Please enter a different email address.'
				),
			} );
			return;
		}

		if ( ! emailValidator.validate( email ) ) {
			this.setState( { validation: this.translate( 'Please enter a valid email address.' ) } );
			return;
		}

		this.setState( { validation: null } );
		this.props.onSave( email );
	},

	onCancel: function() {
		this.props.onCancel();
	},

	onDelete: function() {
		this.props.onDelete();
	},
} );
