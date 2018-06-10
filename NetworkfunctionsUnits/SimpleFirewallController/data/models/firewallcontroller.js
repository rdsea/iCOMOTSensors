import mongoose from '../db';

var FirewallController = mongoose.model('FirewallController', {
    location: String,
    createdAt: Number,
    sliceId: String,
    firewallcontrollerId: String,
});

export default FirewallController;
