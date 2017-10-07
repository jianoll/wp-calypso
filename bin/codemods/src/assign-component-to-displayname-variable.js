// const createClassIdentifier = {
//     type: 'CallExpression',
//     callee: {
//         type: 'MemberExpression',
//         object: {
//             name: 'React',
//         },
//         property: {
//             name: 'createClass',
//         }
//     },
// };

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

// CallExpression
// callee {
  // arguements ( type: [] )
    // get first {
      // type: MemberExpression {
        // object: {
          // type: Identifier
          // name: React
        // }
        // property: {
          // type: Identifier
          // name: createClass
        // }
      // }
    // }
// }

const classWrapperIdentifier = {
    type: 'CallExpression',
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

    const ExportDefaultDeclaration = root
        .find( j.ExportDefaultDeclaration );

    // const ExportDefaultDeclaration = root
    //     .find( j.ExportDefaultDeclaration );

    const enhancedClass = root
        .find( j.CallExpression, classWrapperIdentifier );

    const wrappedCreateClassDeclarations = ExportDefaultDeclaration
        .find( j.CallExpression, createClassIdentifier );

    // wrappedCreateClassDeclarations
    //     .forEach( node => {
    //         // const displayNamePaths = node.find( j.Property, displayNamePropertyIdentifier );
    //         console.log( 'node found', { node: Object.freeze( node ) } );
    //     } )
        // .replaceWith( node =>
        //     j.variableDeclaration( 'const', [
        //         j.identifier( 'displayNameValue' )
        //     ] )
        // );

        // if ( wrappedCreateClassDeclarations.size() ) {
        //     wrappedCreateClassDeclarations.forEach( node => {
        //         console.log( node.get( 'declaration' ) );
        //     } );
        // }

        // enhancedClass.forEach( node => {
        //     const firstArgument = node.get( 'arguments', 0 )
        //     console.log( 'enhancedClass', j( firstArgument ).find( j.CallExpression ).length );
        //     // .get( 'arguments', 0 )
        // } );

        const displayNamePath = wrappedCreateClassDeclarations.find( j.Property, displayNamePropertyIdentifier ).at( 0 );
        const displayNameValue = displayNamePath.get( 'value' ).value.value;

        if ( enhancedClass.size() ) {
            enhancedClass.replaceWith( node => {
                const calleeName = node.get( 'callee', 'name' ).value;
                const firstArgument = node.get( 'arguments', 0 )
                // const displayName =

                // console.log( node, calleeName );
                console.log( {
                    displayNamePath,
                    displayNameValue,
                } );

                // const Component = firstArgument.value;


                // return j.memberExpression( j.identifier( 'props' ), j.identifier( 'property' ) )
                // return j.memberExpression( firstArgument.value )
                // return j.callExpression( j.identifier( calleeName ), [ j.identifier( displayNameValue ) ] );
                //     j.memberExpression( j.thisExpression(), j.identifier( 'props' ) ),
                //     j.identifier( 'property' )
                // )

                // ======================

                return j.variableDeclaration( 'const', [
                    j.variableDeclarator(
                      j.identifier( displayNameValue ),
                      firstArgument.value
                    )
                ] );

            } );
        }

        wrappedCreateClassDeclarations.insertAfter( 'blah' )


    return wrappedCreateClassDeclarations.toSource( {
        useTabs: true,
    } );
}
