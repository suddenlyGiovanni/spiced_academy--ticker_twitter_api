// TWITTER MODULE
//
// SETTINGS: [
//              twitter api secrets,
//              twitter sourece
//           ]
// OUTPUT: usable data
// _____________________________________________________________________________

// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const getTweets = require( './getTweets' );
const getToken = require( './getToken' );
const secrets = require( '../../../secrets' );

// SETTING SECTION VARIABLES: _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const consumerKey = secrets.consumerKey;
const consumerSecret = secrets.consumerSecret;

// EXPORTS _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.tweetsData = function ( screenName ) {
    return getToken( consumerKey, consumerSecret ).then( function ( token ) {
        if ( !Array.isArray( screenName ) ) {
            return getTweets( token, screenName );
        } else {
            return Promise.all( screenName.map( function ( screenName ) {
                getTweets( token, screenName );
            } ) ).then( function ( arrays ) {
                let merged = [];
                while ( arrays.length ) {
                    merged.push.apply( merged, arrays.pop() );
                }
                return merged.sort(
                    function ( a, b ) {
                        new Date( b.created_at ) - new Date( a.created_at );
                    }
                );
            } );
        }
    } );
};
