var batchData = [
    {
        //Add an item to a list
        endpoint: "/_api/web/lists/GetByTitle('Test')/items",
        verb: "POST",
        postData: { "Title": "REST API test 1" }
    },
    {
        //Add an item to a list
        endpoint: "/_api/web/lists/GetByTitle('Test')/items(31)",
        verb: "DELETE",
    }
];

SPRESTBatcher.Execute(batchData)
.done(function (data) {

    //'data' will contain the raw response returned by SharePoint. You can use it as is, or use the ParseResponse function to convert it to a JSON object.
    //var results = SPRESTBatcher.ParseResponse(data)
    //console.log(results);

    console.log(data);
})
.fail(function () {
    console.log("");
})

