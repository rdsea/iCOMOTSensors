const child_process = require("child_process");
const fs = require("fs");
const promisify = require("util").promisify;
const denyAllTemplate = require("./configTemplates/denyIngressTemplate");
const allowIngressTemplate = require("./configTemplates/allowIngressTemplate");
const db = require("./data/db");

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

function createFirewall(config){
    return _setDefaultDenyAll(config).then(() => {
        return _addRules(config)
    }).then(() => {
        return db.insert({
            firewallId: config.serviceName,
            ips: config.ips,
            services: config.services,
            ports: config.ports
        });
    });
}

function deleteFirewall(firewallId){
    return db.findOne({firewallId}).then((firewall) => {
        let deletePromises = [
            exec(`kubectl delete networkpolicies ${firewallId}-deny-all`),
            exec(`kubectl delete networkpolicies ${firewallId}-rules`)
        ];
        return Promise.all(deletePromises);
    }).then((res) => {
        res.forEach((r) => {
            if(r.stderr) {
                console.log(r.stderr);
                throw new Error('error occurred provisioning alarm client');
            }
            console.log(r.stdout);
        });

        return db.remove({firewallId}, {});
    });
}

function getFirewalls(firewallId){
    let query = {
        firewallId,
    };

    if(!(firewallId)) delete query.firewallId;
 
    return db.find(query).then((res) => {
        return res;
    });
}

// by setting a firewall for a service, you will automatically need to 
// whitelist ALL communication
function _setDefaultDenyAll(config){
    let denyTemplate = JSON.parse(JSON.stringify(denyAllTemplate));
    denyTemplate.spec.podSelector.matchLabels.app = config.serviceName;
    denyTemplate.metadata.name = `${config.serviceName}-deny-all`;

    return writeFile(`/tmp/deny-${config.serviceName}.yml`, JSON.stringify(denyTemplate, null, 2), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deny-${config.serviceName}.yml`)
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning alarm client');
        }
        console.log(res.stdout);
        return `${config.serviceName}-deny-all`;
    })
}

function _addRules(config){
    let allowTemplate = JSON.parse(JSON.stringify(allowIngressTemplate));
    allowTemplate.metadata.name = `${config.serviceName}-rules`;
    allowTemplate.spec.podSelector.matchLabels.app = config.serviceName;
    allowTemplate.spec.ingress.push({
        from:[],
        ports:[]
    })

    config.services.forEach((serviceName) => {
        allowTemplate.spec.ingress[0].from.push({
            podSelector: {
                matchLabels: {
                    app: serviceName
                  }
              }
        })
    });

    config.ips.forEach((ip) => {
        allowTemplate.spec.ingress[0].from.push({
            ipBlock: {
                cidr: ip,
            }
        });
    });

    config.ports.forEach((port) => {
        allowTemplate.spec.ingress[0].ports.push({
            protocol: "TCP",
            port: port,
        });
    });

    return writeFile(`/tmp/allow-${config.serviceName}.yml`, JSON.stringify(allowTemplate, null, 2), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/allow-${config.serviceName}.yml`)
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred creating allow firewall rules '+config.serviceName);
        }
        console.log(res.stdout);
        return `${config.serviceName}-allow`;
    })
}

module.exports = {
    createFirewall,
    deleteFirewall,
    getFirewalls
}