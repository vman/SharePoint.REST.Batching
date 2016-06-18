var SPRESTBatcher = (function ($) {
    'use strict';

    var execute = function (batchData) {

        var deferred = new $.Deferred();

        //Unique identifier, will be used to delimit different parts of the request body
        var boundryID = getRandonString();

        var changeSetID = getRandonString();

        //Build Body of the Batch Request
        var batchRequestBody = buildBatchRequestBody(batchData, boundryID, changeSetID);

        //var changeSetRequestBody = buildChangeSetBody()

        //Build Header of the Batch Request
        var batchRequestHeader = buildBatchRequestHeader(batchRequestBody, boundryID);

        //Make the REST API call to the _api/$batch endpoint with the batch data
        var requestHeaders = {
            'X-RequestDigest': $("#__REQUESTDIGEST").val(),
            'Content-Type': 'multipart/mixed; boundary="batch_' + boundryID + '"'
        };

        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/$batch",
            type: "POST",
            headers: requestHeaders,
            data: batchRequestHeader
        }).done(function (batchResponse, textStatus, jqXHR) {
            deferred.resolve(batchResponse);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        });

        return deferred.promise();
    };

    //Build the batch request for each property individually
    function buildBatchRequestBody(batchData, boundryID, changeSetID) {

        var reqData = new Array();
        
        for (var i = 0; i < batchData.length; i++) {

            var currentReq = batchData[i];

            if (currentReq.verb == "POST") {

                var reqRESTUrl = _spPageContextInfo.webAbsoluteUrl + currentReq.endpoint;

                reqData.push('');
                reqData.push('--changeset_' + changeSetID);
                reqData.push('Content-Type: application/http');
                reqData.push('Content-Transfer-Encoding: binary');
                reqData.push('');
                reqData.push(currentReq.verb + ' ' + reqRESTUrl + ' HTTP/1.1');
                reqData.push('Content-Type: application/json;odata=nometadata');
                reqData.push('Accept: application/json;odata=nometadata');
                reqData.push('');
                reqData.push(JSON.stringify(currentReq.postData));
                reqData.push('');
            }
        }

        var csBody = reqData.join('\r\n');

        reqData = new Array(); //test

        reqData.push('--batch_' + boundryID);
        reqData.push('Content-Type: multipart/mixed; boundary="changeset_' + changeSetID +'"');
        reqData.push('Content-Length: ' + csBody.length);
        reqData.push('Content-Transfer-Encoding: binary');
        reqData.push('');
        reqData.push(csBody);
        reqData.push('');
        reqData.push('--changeset_' + changeSetID + '--');

        return reqData.join('\r\n');
    }

    function buildChangeSetBody() {

    }

    function buildChangeSetHeader() {

    }

    //Build the batch header containing the user profile data as the batch body
    function buildBatchRequestHeader(batchRequestBody, boundryID) {
        var headerData = new Array();
        headerData.push('Content-Type: multipart/mixed; boundary="batch__' + boundryID + '"');
        headerData.push('Content-Length: ' + batchRequestBody.length);
        headerData.push('Content-Transfer-Encoding: binary');
        headerData.push('');
        headerData.push(batchRequestBody);
        headerData.push('');
        headerData.push('--batch_' + boundryID + '--');
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

    function getRandonString() {
        return "vrd_" + Math.random().toString(36).substr(2, 9);
    }

    return {
        Execute: execute,
        ParseResponse: parseResponse
    }

})(jQuery);