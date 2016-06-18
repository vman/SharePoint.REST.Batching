var batchData = [
    //{
    //    endpoint: "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='PreferredName')?@v='i:0%23.f|membership|ccdev1@murphyccdev.onmicrosoft.com'",
    //    verb: "GET"
    //},
    {
        endpoint: "/_api/web/lists/GetByTitle('Test')/items",
        verb: "POST",
        postData: { "Title": "Daniel Ricciardo" }
    },
    {
        endpoint: "/_api/web/lists/GetByTitle('Test')/items",
        verb: "POST",
        postData: { "Title": "Kimi Räikkönen" }

    },
    {
        endpoint: "/_api/web/lists/GetByTitle('Test')/items",
        verb: "GET"
    },

    //{
    //    endpoint: "/_api/SP.UserProfiles.PeopleManager/SetSingleValueProfileProperty",
    //    verb: "POST",
    //    postData: {
    //        accountName: "i:0#.f|membership|ccdev2@murphyccdev.onmicrosoft.com",
    //        propertyName: 'AboutMe', //can also be used to set custom single value profile properties
    //        propertyValue: 'batch rest api call'
    //    }
    //}
];

SPRESTBatcher.Execute(batchData)
.done(function (data) {

    //'data' will contain the raw response returned by SharePoint. You can use it as it is or use the ParseResponse function to convert it to a JSON object.
    //var results = SPRESTBatcher.ParseResponse(data)
    //console.log(results);

    console.log(data);
})
.fail(function () {
    console.log("");
})

