const child_process = require("child_process");
const fs = require("fs");
const promisify = require("util").promisify;
const denyAllTemplate = require("./configTemplates/denyIngressTemplate");
const allowIngressTemplate = require("./configTemplates/allowIngressTemplate");
const allowEgressTemplate = require("./configTemplates/allowEgress");
const denyEgressTemplate = require("./configTemplates/denyEgressTemplate")
const db = require("./data/db");

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

function createFirewall(config){
    return _setDefaultDenyAll(config).then(() => {
        return _setDefaultDenyEgress(config);
    }).then(() => {
        return _addIngressRules(config)
    }).then(() => {
        return _addEgressRules(config)
    }).then(() => {
        return db.insert({
            firewallId: config.serviceName,
            ingress: config.ingress,
            egress: config.egress,
        });
    }).catch((err) =>{
        console.error(err);
        console.error("failed to provision firewall "+ JSON.stringify(config));
    });
}

function deleteFirewall(firewallId){
    let fw = null
    return db.findOne({firewallId}).then((firewall) => {
        let deletePromises = [
            exec(`kubectl delete networkpolicies ${firewallId}-deny-ingress`),
            exec(`kubectl delete networkpolicies ${firewallId}-ingress-rules`),
            exec(`kubectl delete networkpolicies ${firewallId}-deny-egress`),
            exec(`kubectl delete networkpolicies ${firewallId}-egress-rules`),
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
    }).catch((err) => {
        console.error("failed to delete "+firewallId);
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
    let denyIngressTemplate = JSON.parse(JSON.stringify(denyAllTemplate));
    denyIngressTemplate.spec.podSelector.matchLabels.app = config.serviceName;
    denyIngressTemplate.metadata.name = `${config.serviceName}-deny-ingress`;

    return writeFile(`/tmp/deny-ingress-${config.serviceName}.yml`, JSON.stringify(denyIngressTemplate, null, 2), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deny-ingress-${config.serviceName}.yml`)
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning alarm client');
        }
        console.log(res.stdout);
        return `${config.serviceName}-deny-ingress`;
    })
}

function _setDefaultDenyEgress(config){
    let denyEgress = JSON.parse(JSON.stringify(denyEgressTemplate));
    denyEgress.spec.podSelector.matchLabels.app = config.serviceName;
    denyEgress.metadata.name = `${config.serviceName}-deny-egress`;

    return writeFile(`/tmp/deny-egress-${config.serviceName}.yml`, JSON.stringify(denyEgress, null, 2), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deny-egress-${config.serviceName}.yml`)
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning alarm client');
        }
        console.log(res.stdout);
        return `${config.serviceName}-deny-egress`;
    })
}

function _addIngressRules(config){
    let allowTemplate = JSON.parse(JSON.stringify(allowIngressTemplate));
    allowTemplate.metadata.name = `${config.serviceName}-ingress-rules`;
    allowTemplate.spec.podSelector.matchLabels.app = config.serviceName;
    allowTemplate.spec.ingress.push({
        from:[],
        ports:[]
    })

    config.ingress.services.forEach((serviceName) => {
        allowTemplate.spec.ingress[0].from.push({
            podSelector: {
                matchLabels: {
                    app: serviceName
                  }
              }
        })
    });

    config.ingress.ips.forEach((ip) => {
        allowTemplate.spec.ingress[0].from.push({
            ipBlock: {
                cidr: ip,
            }
        });
    });

    // config.ingress.ports.forEach((port) => {
    //     allowTemplate.spec.ingress[0].ports.push({
    //         protocol: "TCP",
    //         port: port,
    //     });
    // });

    return writeFile(`/tmp/ingress-${config.serviceName}.yml`, JSON.stringify(allowTemplate, null, 2), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/ingress-${config.serviceName}.yml`)
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred creating allow firewall rules '+config.serviceName);
        }
        console.log(res.stdout);
        return `ingress-${config.serviceName}`;
    })
}

function _addEgressRules(config){
    let allowTemplate = JSON.parse(JSON.stringify(allowEgressTemplate));
    allowTemplate.metadata.name = `${config.serviceName}-egress-rules`;
    allowTemplate.spec.podSelector.matchLabels.app = config.serviceName;
    allowTemplate.spec.egress.push({
        to:[],
        ports:[]
    })

    config.egress.services.forEach((serviceName) => {
        allowTemplate.spec.egress[0].to.push({
            podSelector: {
                matchLabels: {
                    app: serviceName
                  }
              }
        })
    });

    config.egress.ips.forEach((ip) => {
        allowTemplate.spec.egress[0].to.push({
            ipBlock: {
                cidr: ip,
            }
        });
    });

    // config.egress.ports.forEach((port) => {
    //     allowTemplate.spec.egress[0].ports.push({
    //         protocol: "TCP",
    //         port: port,
    //     });
    // });

    return writeFile(`/tmp/egress-${config.serviceName}.yml`, JSON.stringify(allowTemplate, null, 2), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/egress-${config.serviceName}.yml`)
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred creating egress firewall rules '+config.serviceName);
        }
        console.log(res.stdout);
        return `egress-${config.serviceName}`;
    })
}

module.exports = {
    createFirewall,
    deleteFirewall,
    getFirewalls
}