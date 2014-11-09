var Sequelize = require('sequelize'), sequelize = new Sequelize('xamulatordb', 'xamulatoradmin', 'xamulatorswag', {
	host: "xamulatordb.c626h2danuwm.us-west-2.rds.amazonaws.com",
	port: 5432,
	dialect: "postgres"
});
// Objects to use with Sequelize
var Test = sequelize.define('Test', {
	name: Sequelize.STRING,
	points: Sequelize.INTEGER,
	created: Sequelize.DATE,
	testDate: Sequelize.DATE,
	available: Sequelize.BOOLEAN,
	randomized: Sequelize.BOOLEAN
});
var Question = sequelize.define('Question', {
	type: Sequelize.STRING,	
	content: Sequelize.TEXT,
	answers: Sequelize.TEXT,
	correct: Sequelize.TEXT,
	correctAnswerPoints: Sequelize.INTEGER,
	noAnswerPoints: Sequelize.INTEGER,
	wrongAnswerPoints: Sequelize.INTEGER,
	random: Sequelize.BOOLEAN
});
Test.hasMany(Question);

var User = sequelize.define("User", {
	username: Sequelize.STRING,
	password: Sequelize.STRING,
	classes: Sequelize.ARRAY(Sequelize.INTEGER),
	scores: Sequelize.TEXT
});
var Classes = sequelize.define("Class", {
	name: Sequelize.TEXT
});
Classes.hasOne(User, {as: "admin"});
Classes.hasMany(User, {as: "student"});
Classes.hasMany(Test);