//'use strict';
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
chai.use(require('chai-url'));
const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
//base on Google APIs and examples
//https://cloud.google.com/compute/docs/reference/rest/v1/firewalls/list
//var Compute = require('@google-cloud/compute');
//var compute = new Compute();
const google = require('googleapis').google;
const compute = google.compute('v1');

//import * as services from './services';

const PORT = 3002;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();
//put project information into config
var config = require('config');
//global directory of credentials: via environment
var global_dir =process.env.GLOBAL_GOOGLE_CREDENTIAL_DIR;
expect(global_dir).not.to.equal(null);
//just manage a simple list in memory. no real-world
//one needs to do some persistent, etc.

managedsystems = config.get("Access");
console.log("The resoure manages "+managedsystems.length + " systems");

//return resource information
router.get('/', (req, res) => {
    res.json({
        url:'/firewallresource/',
        sampleConfiguration: {
          "resourceId":"simplefirewall1234"
        }
    });
});


//return all systems managed by this resource
router.get('/systems/list', (req, res) => {
 // TODO: we should filter data, return only required data
  res.json(managedsystems);
})

//dummy function: add a new system to be managed.
//the key point is to add also the credential file
//currently just for test - not really use
router.post('/systems', (req, res) => {
  console.log(req.body.system_id);
  console.log(req.body.google_project);
  console.log(req.body.google_service_credential);
  /* this is just for fun, we need to obtain the credential and store
     it into a file in the global directory, and then create a
     short name of the file based on the convension
  */
  var timestamp = (new Date()).getTime();
  credential_file_name =global_dir+"/"+req.body.google_project+"-"+timestamp+".json";
  fs.writeFile(credential_file_name,req.body.google_service_credential , 'utf8');
  newsystem ={
    'system_id':req.body.system_id,
    'google_project':req.body.google_project,
    'google_service_credential':timestamp+".json"
  }
  managedsystems.push(newsystem);
  //add to the list
  res.send("{message:OK}")
});
router.delete('/systems/:systemId', (req,res) => {
  var systemId = req.params.systemId;
  for(var i = 0; i < managedsystems.length; i++) {
    if (managedsystems[i].system_id == systemId) {
      managedsystems.splice(i, 1);
      break;
    }
  }
  res.json({ message: `successfully removed systems`});
})

router.get('/systems/:systemId', (req, res) => {

  var systemId = req.params.systemId;
  for(var i = 0; i < managedsystems.length; i++) {
    if (managedsystems[i].system_id == systemId) {
      res.json(managedsystems[i]);
      break;
    }
  }
})
//for firewall rules
router.post('/systems/:systemId/rules', (req, res) => {
  var selectedsystem = selectsystem(req.params.systemId);
  if (selectedsystem ==null) {
    res.json({message: 'No system with '+req.params.systemId+" found"});
    return;
  }
  authorize(function(authClient) {
    var request = {
      project: selectedsystem.google_project,
      keyFilename: global_dir+"/"+selectedsystem.google_project+"-"+selectedsystem.google_service_credential,
      resource: req.body.resource,
      auth: authClient,
    };

    compute.firewalls.insert(request, function(err, response) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(response.selfLink);
      res.json({selfLink:response.selfLink});
    });
  });

  res.json({ message: `successfully add new rules for `+req.params.systemId});
});

router.get('/systems/:systemId/rules/list', (req, res) => {

  authorize(function(authClient) {
    var selectedsystem = selectsystem(req.params.systemId);
    if (selectedsystem ==null) {
      res.json({message: 'No system with '+req.params.systemId+" found"});
      return;
    }
    var request = {
      project: selectedsystem.google_project,
      keyFilename: global_dir+"/"+selectedsystem.google_project+"-"+selectedsystem.google_service_credential,
      auth: authClient,
    };
  compute.firewalls.list(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(response.data);
    res.json(response.data);
  });
});
});

//delete a rule from the firewall
router.delete('/systems/:systemId/rules/:ruleId', (req, res) => {
  var selectedsystem = selectsystem(req.params.systemId);
  if (selectedsystem ==null) {
    res.json({message: 'No system with '+req.params.systemId+" found"});
    return;
  }
  var selectedrule = req.params.ruleId;
  authorize(function(authClient) {
  var del_request = {
    firewall: selectedrule,
    project: selectedsystem.google_project,
    keyFilename: global_dir+"/"+selectedsystem.google_project+"-"+selectedsystem.google_service_credential,
    auth: authClient
  };

  compute.firewalls.delete(del_request, function(err, response) {
    if (err) {
      console.error(err);
      res.json({message:'error in delete rule '+selectedrule});
    }
    console.log(response);
    res.json({ message: `successfully remove the rule `+req.params.ruleId+' from the system'+req.params.systemId});
  });
});
});

//get a specific rule. need to implement it
router.get('/systems/:systemId/rules/:ruleId', (req, res) => {
  var selectedsystem = selectsystem(req.params.systemId);
  if (selectedsystem ==null) {
    res.json({message: 'No system with '+req.params.systemId+" found"});
    return;
  }
  var selectedrule = req.params.ruleId;
  authorize(function(authClient) {
  var request = {
    firewall: selectedrule,
    project: selectedsystem.google_project,
    keyFilename: global_dir+"/"+selectedsystem.google_project+"-"+selectedsystem.google_service_credential,
    auth: authClient
  };
  compute.firewalls.get(request, function(err, response) {
    if (err) {
      console.error(err);
      res.json({message: 'cannot get '+selectedrule +' from '+req.params.systemId});
      return;
    }
    console.log(response.data);
    res.json(response.data);
  });
  });
});

app.use('/firewallresource', router);
app.listen(PORT, () => {
    console.log(`firewall resource listening at port ${PORT}`)
})

function selectsystem(system_id) {

  for(var i = 0; i < managedsystems.length; i++) {
    if (managedsystems[i].system_id == system_id) {
      return managedsystems[i];
    }
  }
  return null;
}
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
