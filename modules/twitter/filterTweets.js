// TWITTER filterTweets MODULE
//
// INPUT: tweets data
// OUTPUT: filtered tweets

// REQUIRED MODULES

// EXPORTS
module.exports = filteredTweets;

function filterData( data ) {

    let filteredTweets = {
        headlines: []
    };

    data = data.filter( function ( tweet ) {
        return tweet.entities.urls.length == 1;
    } );

    data.forEach( function ( tweet ) {
        // console.log(tweet);
        let headline = {};

        const text = tweet.text.substring( 0, ( tweet.text.indexOf( 'https://' ) - 1 ) );

        headline.headline = text;
        headline.url = tweet.entities.urls[ 0 ].url;
        headline.time = tweet.created_at;

        filteredTweets.headlines.push( headline );
    } );
    // data.forEach(function(item) {
    //     console.log('______________');
    //     console.log(item.text);
    //     console.log(item.created_at);
    //     console.log(item.entities.urls);
    // });
    console.log( filteredTweets );
    return filteredTweets;
}
