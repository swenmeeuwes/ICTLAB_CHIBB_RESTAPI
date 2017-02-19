/**
 * response-wrapper.js
 * Created on 17-02-2017
 * @author Swen Meeuwes
 * 
 * To-do: Find a way to handle responseCodes, if the result is empty it should show '204' but not overwrite if '4xx'
 **/

module.exports = function (responseCode, responseMessage, result) {
    var wrapper = {};

    wrapper.responseCode = responseCode;
    wrapper.responseMessage = responseMessage;
    wrapper.length = result ? result.length : 0;
    wrapper.result = result || []; 

    return wrapper;
};