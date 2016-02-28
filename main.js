/*jslint browser: true*/
/*jslint node: true*/
/*global $, jQuery, alert*/

$(document).ready(function() {
    var editState = 0;

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

    function createEditRegion() {
        if ($('.editRegion').length === 0) {
            var html = '';
            html = html + '<div class="row editRegion">';
            html = html + '    <div class="col-md-4 readme"></div>';
            html = html + '    <div class="col-md-2 col-md-offset-1 options">';
            html = html + '        <button class="addButton"> >>> </button>';
            html = html + '        <div class="languages"></div>';
            html = html + '        <div class="versions">';
            html = html + '            <select class="versionsDropdown" name="select-version"></select>';
            html = html + '        </div>';
            html = html + '    </div>';
            html = html + '    <div class="col-md-4 col-md-offset-1 importrLinks"></div>';
            html = html + '</div>';

            $('body').append(html);
        }
    }

    $('body').on('search', function(event) {
        var searchedLibrary = event.searchString;
        console.log('searched: ' + searchedLibrary);

        var libraryInfo = getLibraryInfo(searchedLibrary);
        var libReadme = getReadme(libraryInfo.readme);

        createEditRegion();
        editState = 1;

        var converter = new showdown.Converter();
        var readmeAsHTML = converter.makeHtml(libReadme);
        $('.readme').html(readmeAsHTML);

    });
})