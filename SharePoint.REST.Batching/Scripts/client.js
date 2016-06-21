var batchData = [
    {
        endpoint: "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
        verb: "GET"
    },
    {
        //Update an item
        endpoint: "/_api/web/lists/GetByTitle('Test')/items(1)",
        verb: "MERGE",
        postData: { 'Title': 'Test Updated' }
    },
    {
        //Add an item to a list
        endpoint: "/_api/web/lists/GetByTitle('Test')/items",
        verb: "POST",
        postData: { "Title": "REST API test second" }
    },
        {
        //Add an item to a list
        endpoint: "/_api/web/lists/GetByTitle('Test')",
        verb: "DELETE",
    }

];

SPRESTBatcher.Execute(batchData)
.done(function (data) {

    //'data' will contain the raw response returned by SharePoint. You can use it as is, or use the ParseResponse function to convert it to a JSON object.
    var results = SPRESTBatcher.ParseResponse(data)
    console.log(results);

    //console.log(data);
})
.fail(function () {
    console.log("");
})

