'use strict';
//base on Google APIs and examples
//https://cloud.google.com/compute/docs/reference/rest/v1/firewalls/list
//var Compute = require('@google-cloud/compute');
//var compute = new Compute();
const google = require('googleapis').google;
const compute = google.compute('v1');

//put project information into config
var config = require('config');
console.log(config.get("Access.project"));
authorize(function(authClient) {
  var request = {
    project: config.get("Access.project"),
    auth: authClient,
  };

  var handlePage = function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    var itemsPage = response['items'];
    if (!itemsPage) {
      return;
    }
    for (var i = 0; i < itemsPage.length; i++) {
      console.log(JSON.stringify(itemsPage[i], null, 2));
    }

    if (response.nextPageToken) {
      request.pageToken = response.nextPageToken;
      compute.firewalls.list(request, handlePage);
    }
  };

  compute.firewalls.list(request, handlePage);
});

function authorize(callback) {
  google.auth.getApplicationDefault(function(err, authClient) {
    if (err) {
      console.error('authentication failed: ', err);
      return;
    }

    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
      authClient = authClient.createScoped(scopes);
    }
    callback(authClient);
  });
}
