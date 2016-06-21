var SPRESTBatcher = (function ($) {
    'use strict';

    var config = {
        requestDigest: $("#__REQUESTDIGEST").val(),
        requestAcceptHeader: "application/json;odata=nometadata"

    };

    var execute = function (batchData) {

        var deferred = new $.Deferred();

        //Unique identifier, will be used to delimit different parts of the request body
        var boundryID = getRandonString();


        //Build Body of the Batch Request
        var batchRequestBody = buildBatchRequestBody(batchData, boundryID);

        //Build Header of the Batch Request
        var batchRequestHeader = buildBatchRequestHeader(batchRequestBody, boundryID);

        //Make the REST API call to the _api/$batch endpoint with the batch data
        var requestHeaders = {
            'X-RequestDigest': config.requestDigest,
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

    function buildBatchRequestBody(batchData, boundryID) {

        var batchRequestBody = "";

        for (var i = 0; i < batchData.length; i++) {

            var currentReq = batchData[i];

            if (currentReq.verb == "GET") {

                var getRequestBody = buildGETRequestBody(currentReq, boundryID);

                batchRequestBody += getRequestBody + "\n";

            }
            else {

                var changeSetID = getRandonString();

                var changeSetBody = buildChangeSetBody(currentReq, changeSetID);

                var changeSetHeader = buildChangeSetHeader(changeSetBody, boundryID, changeSetID);

                batchRequestBody += changeSetHeader + "\n";
            }


        }

        return batchRequestBody;

    }

    function buildGETRequestBody(currentReq, boundryID) {

        var reqData = new Array();

        var reqRESTUrl = _spPageContextInfo.webAbsoluteUrl + currentReq.endpoint;
        reqData.push('--batch_' + boundryID);
        reqData.push('Content-Type: application/http');
        reqData.push('Content-Transfer-Encoding: binary');
        reqData.push('');
        reqData.push(currentReq.verb + ' ' + reqRESTUrl + ' HTTP/1.1');
        reqData.push('Accept: ' + config.requestAcceptHeader);
        reqData.push('');

        return reqData.join('\r\n');
    }

    function buildChangeSetHeader(changeSetBody, boundryID, changeSetID) {

        var changeSetHeader = new Array();
        changeSetHeader.push('--batch_' + boundryID);
        changeSetHeader.push('Content-Type: multipart/mixed; boundary="changeset_' + changeSetID + '"');
        changeSetHeader.push('Content-Length: ' + changeSetBody.length);
        changeSetHeader.push('Content-Transfer-Encoding: binary');
        changeSetHeader.push('');
        changeSetHeader.push(changeSetBody);
        changeSetHeader.push('');
        changeSetHeader.push('--changeset_' + changeSetID + '--');

        return changeSetHeader.join('\r\n');

    }

    function buildChangeSetBody(currentReq, changeSetID) {

        var changeSetBody = new Array();

        var reqRESTUrl = _spPageContextInfo.webAbsoluteUrl + currentReq.endpoint;
        changeSetBody.push('');
        changeSetBody.push('--changeset_' + changeSetID);
        changeSetBody.push('Content-Type: application/http');
        changeSetBody.push('Content-Transfer-Encoding: binary');
        changeSetBody.push('');
        changeSetBody.push(currentReq.verb + ' ' + reqRESTUrl + ' HTTP/1.1');
        changeSetBody.push('Content-Type: ' + config.requestAcceptHeader);
        changeSetBody.push('Accept: ' + config.requestAcceptHeader);
        changeSetBody.push('IF-MATCH: *');
        changeSetBody.push('X-HTTP-Method: ' + currentReq.verb);

        if (typeof currentReq.postData != 'undefined') {
            changeSetBody.push('');
            changeSetBody.push(JSON.stringify(currentReq.postData));
            changeSetBody.push('');
        }

        return changeSetBody.join('\r\n');
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

        var seperatedResponses = batchResponse.split("--batchresponse_");

        var results = [];

        $.each(seperatedResponses, function (index, response) {

            if (response != "") {

                var responseArray = response.split("\r\n");

                var responseObject = {};
                responseObject.status = responseArray[4];
                responseObject.result = responseArray[7];

                results.push(responseObject);
            }
        })

        return results;
    }

    function getRandonString() {
        return "vrd_" + Math.random().toString(36).substr(2, 9);
    }

    return {
        Execute: execute,
        ParseResponse: parseResponse
    }

})(jQuery);