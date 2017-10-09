// half baked at the moment - to test it's current state try running:
// npm run codemod assign-component-to-displayname-variable client/components/forms/form-input-validation/index.jsx

const { get } = require( 'lodash' );

const createClassIdentifier = {
    type: 'CallExpression',
    callee: {
        type: 'MemberExpression',
        object: {
            name: 'React',
        },
        property: {
            name: 'createClass',
        }
    },
};

const classWrapperIdentifier = {
    type: 'CallExpression',
    // Checking that there is a createClass
    arguments: [ createClassIdentifier ],
};


const displayNamePropertyIdentifier = {
    key: {
        name: 'displayName',
    },
};

export default function transformer(file, api) {
    const j = api.jscodeshift;
    const root = j( file.source );

    const exportDefaultDeclarations = root
        .find( j.ExportDefaultDeclaration );

    const argIsCreateClassInstance = arg => (
        get( arg, 'value.callee.object' ) === 'React' &&
        get( arg, 'value.callee.property' ) === 'createClass'
    );

    const argIsExtendsComponentInstance = arg => {
        const type = arg.get( 'type' ).value;

        if ( type !== 'ClassExpression' ) {
            return false;
        }

        const superClass = arg.get( 'superClass' );
        const object = arg.get( 'superClass', 'object' );
        const property = arg.get( 'superClass', 'property' );

        return (
            superClass.value && superClass.value.name === 'Component' ||
            object.value.name === 'React' &&
            property.value.name === 'Component'
        );
    }

    const replaceClassOrGetValue = displayName => arg =>
        argIsCreateClassInstance( arg ) || argIsExtendsComponentInstance( arg )
            ? j.identifier( displayName )
            : arg.value;

    const getMatchingArg = args =>
        args.filter( x => argIsCreateClassInstance( x ) || argIsExtendsComponentInstance( x )  )[ 0 ];

    const wrappedCreateClassDeclarations = exportDefaultDeclarations
        .find( j.CallExpression, createClassIdentifier );

    if ( exportDefaultDeclarations.size() ) {

        exportDefaultDeclarations.forEach( node => {
            const calleeName = node.get( 'declaration', 'callee', 'name' ).value

            if ( ! calleeName ) {
                console.log( 'return early, no immediate function call' );
                return;
            }

            const exportDefaultInstance = j( node );
            const classExpressions = exportDefaultInstance.find( j.ClassExpression );

            const displayNameProperty = classExpressions.find( j.ClassProperty, displayNamePropertyIdentifier ).at( 0 );
            const displayNameValue = displayNameProperty.get( 'value', 'value' ).value;

            if ( ! displayNameValue ) {
                console.log( 'return early, no displayNameValue' );
                return;
            }

            const args = node.get( 'declaration', 'arguments' );
            const matchingArg = getMatchingArg( args );

            if ( matchingArg ) {
                exportDefaultInstance.replaceWith(
                    node => (
                        [
                            j.classDeclaration(
                                j.identifier( displayNameValue ),
                                matchingArg.value.body,
                                matchingArg.value.superClass
                            ),
                            j.exportDefaultDeclaration(
                                j.callExpression(
                                    j.identifier( calleeName ),
                                    args.map( replaceClassOrGetValue( displayNameValue ) )
                                )
                            ),
                        ]
                    )
                );
            }
        } )
    }

    return exportDefaultDeclarations.toSource( {
        useTabs: true,
    } );
}
