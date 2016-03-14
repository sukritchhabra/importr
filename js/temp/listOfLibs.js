var listOfLibs;

$.ajax({
    url: "libraries/libraries.json",
    type: "GET",
    async: false,
    success: function (response) {
        listOfLibs = response;
        console.log('\nRecieved Libraries');
        console.log(listOfLibs);
    },
    error: function (errorReport) {
        console.log('Error happened in AJAX Request!!');
    }
});