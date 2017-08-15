/*
    THE TICKER:
*/
$( document ).ready( function () {
    // keep track of the animation frame (by its uid);
    var rafidH;

    // get a hold of the headlines element
    var $headlines = $( '#headlines' );
    // get a hold of the footlines element


    /*________________________________________________________________________*/
    /*
        GET DATA FORM JASON FILE THROUGHT ajax REQUEST.

        Create a json file containing the text and hrefs of the links in your
        ticker project and remove the links from your html file.
        When the page loads, make an ajax request to fetch the text and hrefs
        and, once you have them, insert the links into the page.
        Once the links are in the page, start the animation.
        To test this you should use http-server.
     */
    ( function () {
        $.ajax( {
            url: '/headlines.json',
            method: 'GET',
            success: function ( data ) {
                setData( data );
            }
        } );
    } )();



    function setData( data ) {
        var headlinesArr = [];

        data.headlines.forEach( function ( headline ) {
            var html = `<a class="headline" href="${headline.url}">${headline.headline}</a>`;
            headlinesArr.push( html );
        } );

        $headlines.append( headlinesArr );

    }


    /*____________________________________________________________________________*/


    $headlines.on( 'mouseenter', function () {
        toggleMove( 'cancelAnimationH', rafidH );
    } );

    $headlines.on( 'mouseleave', function functionName() {
        toggleMove( 'moveHead' );
    } );


    /*________________________________________________________________________*/
    /*________________________________________________________________________*/

    function moveHeadlines() {
        // get a hold of the list its child.
        var headline = $( '.headline' ); // not in sync with the DOM.

        // get a hold of its first child.
        var fChild = headline.eq( 0 );

        // get it's offset from the left (offsetLeft)
        var curX = $headlines.offset().left;

        // when a headlines disappears from view -> detach it from the top of the
        // headline list and add it to the end (appendChild does this
        // automatically for us)
        if ( curX < ( -fChild.width() ) ) {
            // add the width of the element removed to curX value
            curX = curX + fChild.width();
            // now detach the first element of the list and append it to the end of
            // the list.
            $headlines.append( fChild );

        }

        // by decreasing the offset value at each round of the loop i can modify
        // the headline position (but first it has to be set)
        curX += -1;

        // here i'am targeting the inline style property of the headline
        // assigning the new offset value
        $headlines.css( {
            left: curX
        } );

        rafidH = requestAnimationFrame( moveHeadlines );
    }
    /*____________________________________________________________________________*/
    /*____________________________________________________________________________*/


    function toggleMove( action, rafid ) {
        switch ( action ) {
        case 'moveHead':
            moveHeadlines();
            break;
        case 'cancelAnimationH':
            cancelAnimationFrame( rafid );
            break;
        }
    }


    moveHeadlines();
} );
