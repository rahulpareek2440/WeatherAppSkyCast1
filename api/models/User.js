var bcrypt = require('bcrypt');

module.exports = {

	schema: true,

  	attributes: {

  		username:{
  			type: 'string',
  			required: true,
  			unique: true
  		},

  		encryptedPassword:{
  			type: 'string'
  		},

  		searches: {
  			type: 'array',
  			defaultsTo: []
  		},

  		toJSON: function(){
  			var obj = this.toObject();
  			delete obj.encryptedPassword;
  			return obj;
  		},
  	},

  	beforeCreate: function(values, next){
  		bcrypt.genSalt(10, function(err, salt){
  			if (err) next(err);

  			bcrypt.hash(values.password, salt, function(err, hash){
  				if (err) {
            console.log(err);
            return next(err);
          }

  				values.encryptedPassword = hash;
  				next();
  			});
  		});
  	},

  	comparePassword: function(password, user, cb){
  		bcrypt.compare(password, user.encryptedPassword, function(err, match){
  			if (err) cb(err);

  			if (match){
  				cb(null, true);
  			}else{
  				cb(err);
  			}
  		});
  	}
};

