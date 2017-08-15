// TWITTER getTweets MODULE
//
// INPUT: source and bearerToken
// OUTPUT: tweets data unaltered (should return a promise with the tweets)
// _____________________________________________________________________________

// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const request = require( '../request' );

// EXPORTS _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.getTweets = function ( bearerToken, screenName ) {
    // console.log('getTweets', bearerToken );
    return request( {
        method: 'GET',
        host: 'api.twitter.com',
        path: `/1.1/statuses/user_timeline.json?screen_name=${screenName || 'theonion'}`,
        auth: 'Bearer ' + bearerToken
    } ).then( function ( data ) {
        return JSON.parse( data );
    } ).catch( function ( err ) {
        console.error( err.stack, 'an error occurred in getTweets() fn..' );
    } );
};
