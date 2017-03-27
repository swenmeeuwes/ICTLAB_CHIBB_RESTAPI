/**
 * token-secret-provider.js
 * Created on 27-03-2017
 * @author Swen Meeuwes
 * 
 * To-do: Fix, that shit broke
 **/

var fs = require('fs');
var secret = fs.readFileSync('./config/token.secret', 'utf8');

module.export = secret;