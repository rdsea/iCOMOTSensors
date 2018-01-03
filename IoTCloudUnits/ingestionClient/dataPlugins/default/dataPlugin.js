
// function to initialize the data connection
// should be used for setup operations i.e. creating the databases/tables
function init(){
	return new Promise((resolve, reject) => resolve(true));
}

// function used to insert the data (i.e. contents of a message) into your chosed data provider
function insert(topic, data){
	console.log(topic, data)
<<<<<<< HEAD
=======
	return new Promise((resolve, reject) => resolve(true));
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
}

let dataPlugin = {
    init,
    insert,
};

export default dataPlugin;

