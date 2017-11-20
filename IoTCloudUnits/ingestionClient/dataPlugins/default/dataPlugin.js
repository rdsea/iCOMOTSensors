
// function to initialize the data connection
// should be used for setup operations i.e. creating the databases/tables
function init(){
	return new Promise((resolve, reject) => resolve(true));
}

// function used to insert the data (i.e. contents of a message) into your chosed data provider
function insert(topic, data){
	console.log(topic, data)
	return new Promise((resolve, reject) => resolve(true));
}

let dataPlugin = {
    init,
    insert,
};

export default dataPlugin;

