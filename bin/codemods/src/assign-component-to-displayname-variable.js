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
    // need to be able to determine the exact argument position ??
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

    const argIsCreateClassInstance = arg => {
        const object = arg && arg.value && arg.value.callee && arg.value.callee.object && arg.value.callee.object.name;
        const property = arg && arg.value && arg.value.callee && arg.value.callee.property && arg.value.callee.property.name;

        return object === 'React' && property === 'createClass';
    }

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

    const replaceClassOrGetValue = arg =>
        argIsCreateClassInstance( arg ) || argIsExtendsComponentInstance( arg )
            ? j.identifier( 'displayNameValue' )
            : arg.value;

    const getMatchingArg = args =>
        args.filter( x => argIsCreateClassInstance( x ) || argIsExtendsComponentInstance( x )  )[ 0 ];

    const wrappedCreateClassDeclarations = exportDefaultDeclarations
        .find( j.CallExpression, createClassIdentifier );

    // const displayNamePath = wrappedCreateClassDeclarations.find( j.Property, displayNamePropertyIdentifier ).at( 0 );
    // const displayNameValue = displayNamePath.get( 'value' ).value.value;

    if ( exportDefaultDeclarations.size() ) {

        exportDefaultDeclarations.forEach( node => {
            const calleeName = node.get( 'declaration', 'callee', 'name' ).value

            if ( ! calleeName ) {
                console.log( 'return early, no immediate function call' );
                return;
            }

            const exportDefaultInstance = j( node );
            const classExpressions = exportDefaultInstance.find( j.ClassExpression );

            const args = node.get( 'declaration', 'arguments' );
            const matchingArg = getMatchingArg( args );

            // console.log( node );
            // console.log( 'classExpressions:', classExpressions.at( 0 ) );
            // console.log( 'calleeName:', calleeName )
            // console.log( 'argCount:', args )
            console.log( 'match?:', !! matchingArg )

            if ( matchingArg ) {
                exportDefaultInstance.replaceWith(
                    node => (
                        [
                            j.variableDeclaration( 'const', [
                                j.variableDeclarator(
                                  j.identifier( 'displayNameValue' ),
                                  matchingArg.value
                                )
                            ] ),
                            j.exportDefaultDeclaration(
                                j.callExpression(
                                    j.identifier( calleeName ),
                                    args.map( replaceClassOrGetValue )
                                )
                            ),
                        ]
                    )
                );
                // return
            }
        } )

    } else {
        console.log( 'no exportDefaultDeclarations found' );
    }

    return exportDefaultDeclarations.toSource( {
        useTabs: true,
    } );
}
