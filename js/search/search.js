/*
 * search.js
 * https://github.com/sukritchhabra/searchJS
 *
 * Author: Sukrit Chhabra
 * Year: 2016
 */
$(document).ready(function() {
    var searchResult_JSON = listOfLibs;      // Search results recieved from ajax request and used to create the search result list
    var debounceTimeout = 200;  // Global timeout for debouce.
    var searchText = "";        // Search string the user typed
    var keyupCounter = 0;       // Counter to set debounce timeout

    var selectedSearchResult = undefined;   // Final list element that is selected from the search results
    var selectedSearchString = "";          // The topic that is finally selected

    /**
     * A function that searches the tags of a library
     * @param  {[String]} searchItem    [Search item user has entered]
     * @param  {[JSON]} library         [Library we are looking in for the tags]
     * @return {[Boolean]}              [Found in tags or not]
     */
    function searchTags (searchItem, library) {
        var tags = library.tags;
        var numTags = tags.length;
        var search_lowercase = searchItem.toLowerCase();
        var tagsContain = false;

        for (var i = 0; i < numTags; i++) {
            var tag_lowercase = tags[i].toLowerCase();
            if (tag_lowercase.indexOf(search_lowercase) >= 0 || tags[i].indexOf(searchItem) >= 0) {
                tagsContain = true;
                break;
            }
        };

        return tagsContain;
    }

    $('body').on('keyup', '.searchBar', $.debounce(function(event) {
        var keyPressed = event.keyCode;
        if (keyPressed != 37 && keyPressed != 38 && keyPressed != 39 && keyPressed != 40 && keyPressed != 13) {
            keyupCounter = keyupCounter + 1;
            if (keyupCounter%2 != 0) {
                debounceTimeout = 0;
            } else {
                debounceTimeout = 200;
            }

            $('.results').empty();
            $('.results').removeClass('active');

            searchText = $('.searchBar').val();

            if (searchText != "") {

                var len = searchResult_JSON.length;     // Number of search results acquired

                $('.results').addClass('active');
                for (var i = 0; i < len; i++) {
                    var temp = searchResult_JSON[i].title;
                    temp = searchResult_JSON[i].title.toLowerCase();
                    var tempSearchText = searchText.toLowerCase();
                    var inTags = searchTags(searchText, searchResult_JSON[i]);
                    if(temp.indexOf(tempSearchText) >= 0 || searchResult_JSON[i].title.indexOf(tempSearchText) >= 0 || inTags) {
                        $('.results').append('<li>' + searchResult_JSON[i].title + '</li>');
                    }
                }
            }
        }
    }, debounceTimeout));

    $('body').on('keydown', '.searchBar', function(event) {
        var keyPressed = event.keyCode;
        if (keyPressed == 37 || keyPressed == 38 || keyPressed == 39 || keyPressed == 40) {
            var numResults = $('.results li').length;
            var selectedIndex = $('.results li').index($('.selected'));

            if (keyPressed == 40) {     /* If _DOWN_ key is pressed */
                if (selectedIndex < 0) {
                    $('.results li').eq(0).addClass('selected');    // Select the new element
                    selectedIndex = 0;
                    selectedSearchResult = $('.results .selected');
                } else {
                    $('.results li').eq(selectedIndex).removeClass('selected');     // Remove Selection from previously selected element
                    $('.results li').eq((selectedIndex + 1)%numResults).addClass('selected');   // Select the new element
                    selectedIndex = (selectedIndex + 1)%numResults;
                    selectedSearchResult = $('.results .selected');
                }
            } else if (keyPressed == 38) {  /* If _UP_ key is pressed */
                if (selectedIndex == -1) {
                    $('.results li').eq(numResults - 1).addClass('selected');   // Select the new element
                    selectedIndex = numResults - 1;
                    selectedSearchResult = $('.results .selected');
                } else {
                    $('.results li').eq(selectedIndex).removeClass('selected');     // Remove Selection from previously selected element

                    if (selectedIndex < 1) {
                        $('.results li').eq( ( numResults - (Math.abs(selectedIndex-1) ) % numResults)).addClass('selected');   // Select the new element
                        selectedIndex = numResults - (Math.abs(selectedIndex-1) % numResults);
                    } else {
                        $('.results li').eq( (selectedIndex - 1) ).addClass('selected');    // Select the new element
                        selectedIndex = selectedIndex - 1;

                    }
                    selectedSearchResult = $('.results .selected');
                }
            }
        } else if (keyPressed == 13) {
            selectedSearchString = $('.results .selected').text();
            $('.searchBar').val(selectedSearchString);
            $('.results').removeClass('active');
            $('.results').empty();

            /* Creating search event */
            var searchEvent = $.Event("search");
            searchEvent.searchString = selectedSearchString;    // Adding key searchString to search event
            $('body').trigger(searchEvent);
        } else if (keyPressed == 27) {
            $('.searchBar').val("");
            $('.results').removeClass('active');
            $('.results').empty();
        }
    });

    $('body').on('click', '.results li', function(event) {
        selectedSearchString = $(this).text();
        $('.searchBar').val(selectedSearchString);
        $('.results').removeClass('active');
        $('.results').empty();

        /* Creating search event */
        var searchEvent = $.Event("search");
        searchEvent.searchString = selectedSearchString;    // Adding key searchString to search event
        $('body').trigger(searchEvent);
    });
});