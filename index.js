// APP ENTRY POINT: ROUTING

// REQUIRED MODULES
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const getData = require('./modules/getData');

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
            getTweets( data.access_token, function ( err, data ) {
                if ( err ) {
                    console.error( err.stack );
                } else {
                    res.json( filterData( data ) );
                }
            } );
        }
    } );
} );




// SERVER_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
app.listen( 8080, () => {
    console.log( 'listening on port: 8080.' );
} );
