(function ($) {
    'use strict';

    //AccountName of the user
    var userAccountName = encodeURIComponent("i:0#.f|membership|user@yourtenant.onmicrosoft.com");

    //User Profile Properties to fetch
    var propertiesToGet = ["AccountName", "PictureURL", "CustomUserProfileProp1", "CustomUserProfileProp2"];

    //Unique identifier, will be used to delimit different parts of the request body
    var boundryString = getBoundryString();

    //Build Body of the Batch Request
    var userPropertiesBatchBody = buildBatchRequestBody(userAccountName, propertiesToGet, boundryString);

    //Build Header of the Batch Request
    var batchRequestHeader = buildBatchRequestHeader(userPropertiesBatchBody, boundryString);

    //Make the REST API call to the _api/$batch endpoint with the batch data
    var requestHeaders = {
        'X-RequestDigest': jQuery("#__REQUESTDIGEST").val(),
        'Content-Type': 'multipart/mixed; boundary="batch_' + boundryString + '"'
    };

    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/$batch",
        type: "POST",
        headers: requestHeaders,
        data: batchRequestHeader,
        success: function (batchResponse) {
            //Convert the text response to an array containing JSON objects of the results
            var results = parseResponse(batchResponse);

            //Properties will be returned in the same sequence they were added to the batch request
            for (var i = 0; i < propertiesToGet.length; i++) {
                console.log(propertiesToGet[i] + " is " + results[i].value);
            }
        },
        error: function (jqxr, errorCode, errorThrown) {
            console.log(jqxr.responseText);
        }
    });

    //Build the batch request for each property individually
    function buildBatchRequestBody(userAccountName, propertiesToGet, boundryString) {
        var propData = new Array();
        for (var i = 0; i < propertiesToGet.length; i++) {
            var getPropRESTUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='" + propertiesToGet[i] + "')?@v='" + userAccountName + "'";
            propData.push('--batch_' + boundryString);
            propData.push('Content-Type: application/http');
            propData.push('Content-Transfer-Encoding: binary');
            propData.push('');
            propData.push('GET ' + getPropRESTUrl + ' HTTP/1.1');
            propData.push('Accept: application/json;odata=nometadata');
            propData.push('');
        }
        return propData.join('\r\n');
    }

    //Build the batch header containing the user profile data as the batch body
    function buildBatchRequestHeader(userPropsBatchBody, boundryString) {
        var headerData = new Array();
        headerData.push('Content-Type: multipart/mixed; boundary="batch__' + boundryString + '"');
        headerData.push('Content-Length: ' + userPropsBatchBody.length);
        headerData.push('Content-Transfer-Encoding: binary');
        headerData.push('');
        headerData.push(userPropsBatchBody);
        headerData.push('');
        headerData.push('--batch_' + boundryString + '--');
        return headerData.join('\r\n');
    }

    function parseResponse(batchResponse) {
        //Extract the results back from the BatchResponse
        var results = $.grep(batchResponse.split("\r\n"), function (responseLine) {
            try {
                return responseLine.indexOf("{") != -1 && typeof JSON.parse(responseLine) == "object";
            }
            catch (ex) { /*adding the try catch loop for edge cases where the line contains a { but is not a JSON object*/ }
        });

        //Convert JSON strings to JSON objects
        return $.map(results, function (result) {
            return JSON.parse(result);
        });
    }

    function getBoundryString() {
        return "vrd_" + Math.random().toString(36).substr(2, 9);
    }

})(jQuery);