/*jslint browser: true*/
/*jslint node: true*/
/*global $, jQuery, alert*/

$(document).ready(function() {
    function getLibraryInfo(libraryName) {
        var info;
        $.ajax({
            url: "/libraries/" + libraryName + "/package.json",
            type: "GET",
            async: false,
            success: function (response) {
                info = JSON.parse(response);
                console.log('recieved json:');
                console.log(info);
            },
            error: function (errorReport) {
                console.log('Error happened in AJAX Request!!');
            }
        });
        return info;
    }

    $('body').on('search', function(event) {
        var searchedLibrary = event.searchString;
        console.log('searched: ' + searchedLibrary);

        var libraryInfo = getLibraryInfo(searchedLibrary);
    });
})