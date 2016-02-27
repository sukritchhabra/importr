/*jslint browser: true*/
/*jslint node: true*/
/*global $, jQuery, alert*/

$(document).ready(function() {
    $('body').on('search', function(event) {
        var searchedString = event.searchString;
        console.log('searched: '+searchedString);
    });
})