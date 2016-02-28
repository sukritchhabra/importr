/*jslint browser: true*/
/*jslint node: true*/
/*global $, jQuery, alert*/

$(document).ready(function() {
    /**
     * A function to get a libraries JSON file via AJAX
     * @param  {[String]} libraryName   [Name of the library, the information of which is needed]
     * @return {[JSON]}                 [JSON object/file acuired via AJAX]
     */
    function getLibraryInfo(libraryName) {
        var info;
        $.ajax({
            url: "libraries/" + libraryName + "/package.json",
            type: "GET",
            async: false,
            success: function (response) {
                info = response;
                console.log('recieved json:');
                console.log(info);
            },
            error: function (errorReport) {
                console.log('Error happened in AJAX Request!!');
            }
        });
        return info;
    }

    /**
     * A function to get the README of a library
     * @param  {[String]} readmeLink    [ Link to the README of the library ]
     * @return {[string]}               [ The README that was recievec ]
     */
    function getReadme(readmeLink) {
        var readme;
        $.ajax({
            url: readmeLink,
            type: "GET",
            async: false,
            success: function (response) {
                readme = response;
                console.log('recieved readme:');
                console.log(readme);
            },
            error: function (errorReport) {
                console.log('Error happened in AJAX Request!!');
            }
        });
        return readme;
    }

    $('body').on('search', function(event) {
        var searchedLibrary = event.searchString;
        console.log('searched: ' + searchedLibrary);

        var libraryInfo = getLibraryInfo(searchedLibrary);
        var libReadme = getReadme(libraryInfo.readme);

        var converter = new showdown.Converter();
        var readmeAsHTML = converter.makeHtml(libReadme);
        $('.readme').html(readmeAsHTML);

    });
})