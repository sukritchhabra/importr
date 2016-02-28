/*jslint browser: true*/
/*jslint node: true*/
/*global $, jQuery, alert*/

$(document).ready(function() {
    var editState = 0;
    var currentLibInfo;

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
                // console.log(readme);
            },
            error: function (errorReport) {
                console.log('Error happened in AJAX Request!!');
            }
        });
        return readme;
    }

    /**
     * Creates the Edit Region in the markup
     */
    function createEditRegion() {
        if ($('.editRegion').length === 0) {
            var html = '';
            html = html + '<div class="row editRegion">';
            html = html + '    <div class="readme"></div>';
            html = html + '    <div class="options">';
            html = html + '        <button class="addButton"> >>> </button>';
            html = html + '        <div class="languages"></div>';
            html = html + '        <div class="versions">';
            html = html + '            <select class="versionsDropdown" name="select-version"></select>';
            html = html + '        </div>';
            html = html + '    </div>';
            html = html + '    <div class="importrLinks">';
            html = html + '        <ul class="cdnLinks"></ul>';
            html = html + '    </div>';
            html = html + '</div>';

            $('body').append(html);
            $('.cdnLinks').sortable({
                cursor: "move",
                containment: "parent",
                axis: "y"
            });
        }
    }

    /**
     * Adds all available versions of the library to the dropdown list
     * @param {[JSON]} listOfVersions [An array of all the available versions as strings]
     */
    function addVersions(listOfVersions) {
        $('.versionsDropdown').empty();
        for (var i = 0; i < listOfVersions.length; i++) {
            $('.versionsDropdown').append('<option value="'+ listOfVersions[i] +'">'+ listOfVersions[i] +'</option>');
        };
    }

    /**
     * Creates Radio buttons for all available types
     * @param {[JSON]} availableLanguages [description]
     */
    function addLanguages(availableLanguages) {
        $('.editRegion .languages').empty();
        var i = 0;
        $.each(availableLanguages, function(index, val) {
             if (val) {
                 var html = '';
                 html = html + '<label for="language"><input type="radio" name="language" value="' + index + '" ';
                 if (i == 0) {
                     html = html + 'checked';
                    i++;
                 }
                 var textUppercase = index.toUpperCase();
                 html = html + '><span>' + textUppercase + '</span></label>';
                 $('.editRegion .languages').append(html);
             }
        });
    }

    /**
     * Function adds CDN link to the link section on the right side.
     * @param {[String]} linkStructure [Structure of the CDN Link as described in package.json]
     * @param {[String]} type          [Type selected by user]
     * @param {[String]} version       [version selected by user]
     */
    function addLink(linkStructure, type, version) {
        var pattern = "{version}";
        var regEx = new RegExp(pattern, "g");
        var cdnLink = linkStructure.replace(regEx, version);

        pattern = "{type}";
        regEx = new RegExp(pattern, "g");
        cdnLink = cdnLink.replace(regEx, type);

        pattern = "{minifiedState}";
        regEx = new RegExp(pattern, "g");
        cdnLink = cdnLink.replace(regEx, ''); // Handle after adding minified radio buttons

        var finalTag = '';
        if (type == 'css') {
            finalTag = finalTag + '&ltlink href="' + cdnLink + '" rel="stylesheet" type="text/css"&gt';
        } else {
            finalTag = finalTag + '&ltscript src="' + cdnLink + '"&gt&lt/script&gt';
        }

        $('.importrLinks .cdnLinks').append('<li class="cdnLink">' + finalTag + '</li>');
    }

    $('body').on('click', '.addButton', function(event) {
        var link = currentLibInfo.cdnLinkStructure;
        var type = $('.editRegion .languages input[name="language"]:checked').val();
        var ver = $('.editRegion .versionsDropdown').val();
        addLink(link, type, ver);
    });


    $('body').on('search', function(event) {
        var searchedLibrary = event.searchString;
        console.log('searched: ' + searchedLibrary);

        var libraryInfo = getLibraryInfo(searchedLibrary);
        currentLibInfo = libraryInfo;
        var libReadme = getReadme(libraryInfo.readme);

        createEditRegion();
        editState = 1;

        var converter = new showdown.Converter();
        var readmeAsHTML = converter.makeHtml(libReadme);
        $('.readme').html(readmeAsHTML);

        addVersions(libraryInfo.versions);
        addLanguages(libraryInfo.languages);
    });
});


























