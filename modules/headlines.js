// TWITTER filterTweets MODULE
//
// INPUT: tweets data
// OUTPUT: filtered tweets

// REQUIRED MODULES

// EXPORTS
module.exports.filterTweets = function ( tweets ) {

    let filteredTweets = {
        headlines: []
    };

    tweets = tweets.filter( function ( tweet ) {
        return tweet.entities.urls.length == 1;
    } );

    tweets.forEach( function ( tweet ) {
        // console.log(tweet);
        let headline = {};

        const text = tweet.text.substring( 0, ( tweet.text.indexOf( 'https://' ) - 1 ) );

        headline.headline = text;
        headline.url = tweet.entities.urls[ 0 ].url;
        headline.time = tweet.created_at;

        filteredTweets.headlines.push( headline );
    } );
    
    console.log( filteredTweets );
    return filteredTweets;
};
