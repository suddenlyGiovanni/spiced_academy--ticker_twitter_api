// TWITTER getTweets MODULE
//
// INPUT: source and bearerToken
// OUTPUT: tweets data unaltered (should return a promise with the tweets)

// REQUIRED MODULES
const https = require( 'https' );

// EXPORTS
module.exports = tweets;

function getTweets( bearerToken, callback ) {
    // console.log('getTweets', bearerToken );
    const reqOptions = {
        method: 'GET',
        host: 'api.twitter.com',
        path: '/1.1/statuses/user_timeline.json?screen_name=realDonaldTrump',
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        }
    };
    const req = https.request( reqOptions, ( res ) => {


        if ( res.statusCode != 200 ) {
            callback( res.statusCode );
            return;
        }

        // console.log( `STATUS: ${res.statusCode}` );

        let body = '';

        res.on( 'data', ( chunck ) => {
            body += chunck;
        } );


        res.on( 'end', () => {
            try {
                body = JSON.parse( body );

                // console.log(body);

                callback( null, body );
            } catch ( err ) {
                callback( err );
            }
        } );


    } );

    req.on( 'error', ( err ) => {
        callback( err );
    } );

    req.end();
}
