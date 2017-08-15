// REQUIRED MODULES
const express = require( 'express' );
const https = require( 'https' );
const bodyParser = require( 'body-parser' );
const secrets = require( './secrets.json' );

const authSecrets = 'Basic ' + new Buffer( secrets.consumerKey + ':' + secrets.consumerSecret ).toString( 'base64' );
// console.log( authSecrets );

// EXPRESS
const app = express();

// MIDDLEWARE __________________________________________________________________

// body parser _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
app.use( bodyParser.urlencoded( {
    extended: false
} ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// serve static assets _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
app.use( express.static( `${__dirname}/public` ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// error handling _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
app.use( ( err, req, res, next ) => {
    console.error( err.stack );
    res.status( 500 ).send( 'Something broke!' );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// end point from where ticker should get the data
app.get( '/headlines.json', ( req, res ) => {

    getToken( function ( err, data ) {
        if ( err ) {
            console.error( err.stack );
        } else {
            getTweets( data.access_token, function (err, data) {
                if (err) {
                    console.error(err.stack);
                } else {
                    res.json(filterData(data));
                }
            } );
        }
    } );
} );

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
    const req = https.request( reqOptions, function ( res ) {
        // console.log( `STATUS: ${res.statusCode}` );
        // console.log( `HEADERS: ${JSON.stringify(res.headers)}` );

        if ( res.statusCode != 200 ) {
            callback( res.statusCode );
            return;
        }


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

// getToken( function ( err, data ) {
//     if ( err ) {
//         console.error( err.stack );
//     } else {
//         getTweets( data.access_token, filterData );
//     }
// } );

// now refactor the getToken to use promises


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


function filterData( data ) {

    let filteredTweets = {
        headlines: []
    };

    data = data.filter( function ( tweet ) {
        return tweet.entities.urls.length == 1;
    } );

    data.forEach(function (tweet) {
        // console.log(tweet);
        let headline = {};

        const text = tweet.text.substring(0, (tweet.text.indexOf('https://') -1));

        headline.headline = text;
        headline.url = tweet.entities.urls[0].url;
        headline.time = tweet.created_at;

        filteredTweets.headlines.push(headline);
    });
    // data.forEach(function(item) {
    //     console.log('______________');
    //     console.log(item.text);
    //     console.log(item.created_at);
    //     console.log(item.entities.urls);
    // });
    console.log(filteredTweets);
    return filteredTweets;
}



app.listen( 8080, () => {
    console.log( 'listening on port: 8080.' );
} );
