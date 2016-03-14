/*jslint browser: true*/
/*jslint node: true*/
/*global $, jQuery, alert*/

$(document).ready(function() {
    var clipboard;
    var editState = 0;  // 1 implies editRegion is displayed
    var currentLibInfo;

    var sortStartIndex = 0;
    var sortStopIndex = 0;

    var addedTags = [];

    /**
     * A function to get a libraries JSON file via AJAX
     * @param  {[String]} libraryName   [Name of the library, the information of which is needed]
     * @return {[JSON]}                 [JSON object/file acuired via AJAX]
     */
    function getLibraryInfo(libraryName) {
        var info;
        $.ajax({
            url: "libraries/" + libraryName + "/lib.json",
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
            if ( $('.faq').length === 1 ) { $('.faq').remove(); }

            var html = '';
            html = html + '<div class="row editRegion">';
            html = html + '    <div class="readme"></div>';
            html = html + '    <div class="options">';
            html = html + '        <button class="addButton"> >>> </button>';
            html = html + '        <div class="languages"></div>';
            html = html + '        <div class="versions">';
            html = html + '            <select class="versionsDropdown" name="select-version"></select>';
            html = html + '        </div>';
            html = html + '        <span class="copySuccess">Copied!</span>';
            html = html + '    </div>';
            html = html + '    <div class="importrLinks">';
            html = html + '        <span class="copyButton fa fa-files-o"></span>';
            html = html + '        <ul class="cdnLinks"></ul>';
            html = html + '    </div>';
            html = html + '</div>';

            $('body').append(html);
            $('.cdnLinks').sortable({
                cursor: "move",
                containment: "parent",
                axis: "y",
                cancel: ".deleteLink",
                start: function(event, ui) {
                    sortStartIndex = ui.item.index();
                },
                stop: function(event, ui) {
                    sortStopIndex = ui.item.index();
                    addedTags.move(sortStartIndex, sortStopIndex);
                }
            });

            setUpClipboard();
        }
    }


    /**
     * Function to sort tags array when user sorts list
     * @param  {[int]} from [Taken from index]
     * @param  {[int]} to   [Put at index]
     */
    Array.prototype.move = function (from, to) {
        if (to >= this.length) {
            var k = to - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(to, 0, this.splice(from, 1)[0]);
        return this; // for testing purposes
    };

    /**
     * Function to setup Clipboard
     */
    function setUpClipboard() {
        clipboard = new Clipboard('.copyButton', {
            text: function(trigger) {
                return getAllTags();
            }
        });

        clipboard.on('success', function(e) {
            successfullCopy(e);
        });

        clipboard.on('error', function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }


    /**
     * Function to execute when copy is successfull
     */
    function successfullCopy(event) {
        // console.info('Action:', event.action);
        // console.info('Text:', event.text);
        // console.info('Trigger:', event.trigger);

        // event.clearSelection();
        $('.copySuccess').fadeIn('200');
        $('.copySuccess').fadeOut('400');
    }


    /**
     * Get all tags as one string
     * @return {[String]} [All tags combined]
     */
    function getAllTags() {
        var copyText = '';
        for (var i = 0; i < addedTags.length; i++) {
            copyText = copyText + addedTags[i] + '\n';
        }
        return copyText;
    }


    /**
     * Adds all available versions of the library to the dropdown list
     * @param {[JSON]} listOfVersions [An array of all the available versions as strings]
     */
    function addVersions(listOfVersions) {
        $('.versionsDropdown').empty();
        for (var i = 0; i < listOfVersions.length; i++) {
            $('.versionsDropdown').append('<option value="'+ listOfVersions[i] +'">'+ listOfVersions[i] +'</option>');
        }
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

        var tagForCopy = '';
        var finalTag = '<span class="tag">';
        if (type == 'css') {
            finalTag = finalTag + '&ltlink href="' + cdnLink + '" rel="stylesheet" type="text/css"&gt';
            tagForCopy = tagForCopy + '<link href="' + cdnLink + '" rel="stylesheet" type="text/css">';
        } else {
            finalTag = finalTag + '&ltscript src="' + cdnLink + '"&gt&lt/script&gt';
            tagForCopy = tagForCopy + '<script src="' + cdnLink + '"></script>';
        }
        finalTag = finalTag + '</span>';

        var deleteButton = '<span class="deleteLink fa fa-times"></span>';

        $('.importrLinks .cdnLinks').append('<li class="cdnLink">' + finalTag + deleteButton + '</li>');
        addedTags.push(tagForCopy);
        // console.log(addedTags);
    }


    /**
     * Removing a link fomr the list the user clicks on the delete button
     */
    $('body').on('click', '.deleteLink', function(event) {
        console.log($(this));
        var listElement = $(this).closest('.cdnLink');
        var indexOfListElement = $('.cdnLink').index(listElement);
        addedTags.splice(indexOfListElement, 1);
        // console.log(addedTags);
        listElement.remove();
        // $('.importrLinks').hide().show(0);
    });


    $('body').on('click', '.addButton', function(event) {
        var link = currentLibInfo.cdnLinkStructure;
        var type = $('.editRegion .languages input[name="language"]:checked').val();
        var ver = $('.editRegion .versionsDropdown').val();
        addLink(link, type, ver);
    });


    $('body').on('search', function(event) {
        var searchedLibrary = event.searchString;
        console.log('searched: ' + searchedLibrary);

        if (searchedLibrary == "") {
            console.error("Searched For an EMPTY String!");
        } else {
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
        }

    });

    $('body').on('click', '.link', function(event) {
        if ($(this).data('href') != "") {
            window.location.href = $(this).data('href');
        }
    });
});


























