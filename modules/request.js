// NODE http/s.request MODULE (promisified)
//
// INPUT: options: { http/s headers and body options }
// OUTPUT: a promise that if resolved contains the http/s data

// REQUIRED MODULES
const http = require( 'http' );
const https = require( 'https' );


// EXPORTS: request(options):
//          returns http data wrap in a promise
module.exports = function ( options ) {
    new Promise( function ( resolve, reject ) {
        const headers = {};

        if ( options.auth ) {
            headers.Authorization = options.auth;
        }

        if ( options.contentType ) {
            headers[ 'Content-Type' ] = options.contentType;
        }

        // ternary operator to switch http protocol.
        // then normal http.request(options, function(req, res) {...});
        const req = ( options.protocol == 'http' ? http : https ).request( {
            method: options.method || 'GET',
            host: options.host,
            path: options.path,
            headers: headers
        }, function ( res ) {
            if ( res.statusCode != 200 ) {
                return reject( res.statusCode );
            } else {
                let data = '';

                res.on( 'data', ( chunck ) => {
                    data += chunck;
                } );

                res.on( 'end', function () {
                    resolve( data );
                } );
            }
        } );

        // check if the req generates an error and handle with a reject promise
        req.on( 'error', reject );

        if ( options.body ) {
            req.write( options.body );
        }

        req.end();

    } );
};
