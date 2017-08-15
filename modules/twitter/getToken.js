// TWITTER getToken MODULE
//
// INPUT: authSecrets
// OUTPUT: bearerToken (should return a promise with the bearerToken)
// _____________________________________________________________________________

// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const request = require( '../request' );

// EXPORTS _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.getToken = function (consumerKey, consumerSecret) {
    let authorization = `${consumerKey}:${consumerSecret}`;
    return request( {
        method: 'POST',
        host: 'api.twitter.com',
        path: '/oauth2/token',
        auth: 'Basic ' + Buffer( authorization ).toString( 'base64' ),
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        body: 'grant_type=client_credentials'
    } ).then( function ( data ) {
        return JSON.parse( data ).access_token;
    } ).catch( function ( err ) {
        console.error( err.stack, 'an error occurred in getToken() fn..' );
    } );
};
