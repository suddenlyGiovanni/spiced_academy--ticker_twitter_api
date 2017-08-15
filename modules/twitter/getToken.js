// TWITTER getToken MODULE
//
// INPUT: authSecrets
// OUTPUT: bearerToken (should return a promise with the bearerToken)

// REQUIRED MODULES
const https = require( 'https' );
const secrets = require( '../../../secrets.json' );

// EXPORTS
module.exports = token;

// MODULE VARIABLES:
const authSecrets = 'Basic ' + new Buffer( secrets.consumerKey + ':' + secrets.consumerSecret ).toString( 'base64' );


// make the request to twitter through the server.
// use the node server
function getToken( callback ) {

    const reqOptions = {
        method: 'POST',
        host: 'api.twitter.com',
        path: '/oauth2/token',
        headers: {
            'Authorization': authSecrets,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };

    const req = https.request( reqOptions, ( res ) => {
        // console.log( `STATUS: ${res.statusCode}` );
        // console.log( `HEADERS: ${JSON.stringify(res.headers)}` );

        if ( res.statusCode != 200 ) {
            callback( res.statusCode );
            return;
        } else {

            let body = '';

            res.on( 'data', ( chunck ) => {
                body += chunck;
            } );

            res.on( 'end', () => {
                try {
                    body = JSON.parse( body );
                    callback( null, body );
                } catch ( err ) {
                    callback( err );
                }
            } );
        }
    } );

    // check if the req generates an error and handle it in the async way by passing it to the callback.
    req.on( 'error', ( err ) => {
        callback( err );
    } );
    // write to the body of the post the required string from twitter.
    req.write( 'grant_type=client_credentials' );

    // close the request
    req.end();
}
