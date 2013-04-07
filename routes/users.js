var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

database = null;

mongo.connect(process.env.MONGOLAB_URI, {}, dbConnectionOpen);

function dbConnectionOpen(err, db) {
    database = db;
    if(!err) {
        console.log("Connected to 'users' database");
        db.collection('users', {safe:true}, function(err, collection) {
            if (err) {
                console.log("La coleccion usuarios no existe. Creando la coleccion");
                populateDB();
            }
        });
    }
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Recuperando datos de usuario: ' + id);
    database.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
	console.log('Recuperando datos de usuarios');
    database.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function(req, res) {
    var user = req.body;
    console.log('Agregando usuario: ' + JSON.stringify(user));
    database.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'Ocurrio un error'});
            } else {
                console.log('Usuario agregado con exito: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    delete user._id;
    console.log('Updating usuario: ' + id);
    console.log(JSON.stringify(user));
    database.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
};

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Borrando usuario: ' + id);
    database.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};


var populateDB = function() {
 

	  var users = [
    {
        nombre: "Noelia Franco",
        email: "nfranco@ar.ibm.com",
        direccion: "Lopez 414",
        telefono: "3414901862",
        celular: "3415973905",
		picture: "user_4.png"
    },
    {
        nombre: "Ricardo Gonzalez",
        email: "rgonzalez@yahoo.com.ar",
        direccion: "Italia 1233",
        telefono: "3414657834",
        celular: "",
		picture: "user_1.png"  
	},
    {
       nombre: "Mauro Carcamo",
        email: "mc_rgloll@yahoo.com.ar",
        direccion: "Dorrego 2311",
        telefono: "3414324566",
        celular: "",
		picture: "user_2.png"  
    },
    {
        nombre: "Mariana Perez",
        email: "marian_perez@live.com.ar",
        direccion: "Mitre 322",
        telefono: "3414337834",
        celular: "",
		picture: "user_3.png"  
    }];

    database.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
};