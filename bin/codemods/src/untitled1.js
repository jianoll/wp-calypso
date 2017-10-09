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

    const replaceClassOrGetValue = arg =>
        argIsCreateClassInstance( arg )
            ? j.identifier( displayNameValue )
            : arg.value;

    const getMatchingArg = node => {
        const args = node.get( 'declaration', 'arguments' );

        return args.filter( argIsCreateClassInstance )[ 0 ];
    }

    const enhancedClass = root
        .find( j.CallExpression, classWrapperIdentifier );

    const wrappedCreateClassDeclarations = exportDefaultDeclarations
        .find( j.CallExpression, createClassIdentifier );

    const displayNamePath = wrappedCreateClassDeclarations.find( j.Property, displayNamePropertyIdentifier ).at( 0 );
    const displayNameValue = displayNamePath.get( 'value' ).value.value;

    if ( exportDefaultDeclarations.size() ) {
        exportDefaultDeclarations.replaceWith( node => {
            const calleeName = node.get( 'declaration', 'callee', 'name' ).value
            const args = node.get( 'declaration', 'arguments' );
            const matchingArg = getMatchingArg( node );

            if ( !matchingArg ) {
                return [
                    j.variableDeclaration( 'const', [
                        j.variableDeclarator(
                          j.identifier( displayNameValue ),
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
            }

            return node; // ??????
        } );
    }

    return exportDefaultDeclarations.toSource( {
        useTabs: true,
    } );
}
