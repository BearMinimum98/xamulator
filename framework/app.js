﻿/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),
	override = require('method-override'),
	mysql = require('mysql'),
	bodyParser = require('body-parser'),
	logger = require('express-logger'),
	sprintf = require("sprintf-js").sprintf,
	vsprintf = require("sprintf-js").vsprintf,
	expressErrorHandler = require("express-error-handler"),
	routes = require('./routes'),
	test = require('./routes/test.js'),
	newtest = require('./routes/newtest.js'),
	app = express(),
	server;

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger({
	path: 'logs/log.txt'
}));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


var connection = mysql.createConnection({
	host: "angelhack.c626h2danuwm.us-west-2.rds.amazonaws.com",
	user: "angelhack",
	password: "angelhack",
	database: "testing"
});


/** all functions and code definitions go below
 */

var dateNow = new Date().toISOString().slice(0, 19).replace("T", " ");

function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function log(msg) {
	if (console !== undefined && msg !== undefined) {
		console.log(msg);
	}
}

function formatquestionsDbEntries(reference, questionsArray) {
		var result = [null];
		for (var i = 0; i < array.legnth; i++) {
			result.push()
		}
		return result;
	}
	//Inserting into Db should only be used for inserting after array of values has been correctly formatted
	//Use formatDB_NAMEDbEntries for formatted Array
function insertIntoDb(db, array) {
	if (array !== undefined && db !== undefined) {
		var format = '%s';
		for (var i = 0; i < array.length - 1; i++) {
			format = "%s, " + format;
		}
		connection.query(connection.escape(sprintf("INSERT INTO %s VALUES " + vsprintf(format, [null].concat(array)), db)));
	}
}


app.get('/', routes.index);
app.get('/test', test.index);
app.get('/newtest', newtest.index);
app.post('/newtest', function(request, response) {
	connection.connect();
	response.set("Access-Control-Allow-Origin", "*");
	response.json(request.body);
	var body = request.body,
		answersCounted = 0,
		limit;

	//All form information together
	var entries = {
		"tests": [
			connection.escape(body.testName),
			connection.escape(body.testPoints),
			connection.escape(dateNow),
			connection.escape(body.datetimeTest.replace("T", " ")),
			connection.escape((new Date(body.datetimeTest).parse() <= dateNow.parse()) ? 0 : 1),
			connection.escape(1),
			connection.escape(0),
			connection.escape('') //examtime ?
		],

		"questions": [
			connection.escape(body.questionType), //questiontype
			connection.escape(body.question), //questionContent
			connection.escape(JSON.stringify(body.answer)), //answers
			connection.escape(body.correctAnswer), //correctAnswer
			connection.escape(testId), //Test Foreign Key not null
			connection.escape(''), //Fullpoints
			connection.escape(''), //noAnswerPoints
			connection.escape(''), //wrongAnswerPoints
			connection.escape('') //isRandom
		]

	};
	//Insert test information into databse
	insertIntoDb("tests", entries.tests);
	//Retrieve from database the proper testId Foreign Key and sets all of the Foreign Key References to the Correct Foreign Key
	connection.query("SELECT P_Id FROM tests ORDER BY P_Id DESC LIMIT 1", function(err, row, fields) {
		if (rows[0].P_Id !== null) {
			entries.question[4] = rows[0].P_Id;
		}
	});

	//One question case
	if (typeof(entries.questions[0] === "string")) {
		insertIntoDb("questions", entries.questions)
	}
	//Many questions case
	else {
		for (var i = 0; i < entries.questions[0].legnth; i++) {
			insertIntoDb("questions", formatDbEntries(i, entries.questions))
		}
	}


	//Redirect user to a finsh page - NEEDS TO BE IMPLEMENTED
	response.redirect('/');
});

app.post("/login/", function(request, response) {
	connection.query("SELECT * FROM students WHERE username='" + connection.escape(request.body.username) + "'", function(err, rows, fields) {
		if (rows.length > 0) {
			if (rows[0].password == request.body.password) {
				// send auth token????
			}
		} else {
			response.json({
				"error": "no such user found"
			});
		}
	});
	request.body.username;
	request.body.password;
});
// Get test questions
app.post("/taketest/", function(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	var body = req.body;
	connection.query("SELECT * FROM tests WHERE P_Id=" + connection.escape(body), function(err, rows, fields) {
		if (rows.length > 0) {
			if (rows[0].testAvailable) {
				var isRandomized = rows[0].randomnized;
				connection.query("SELECT * FROM questions WHERE test=" + connection.escape(body), function(err, rows, field) {
					var questionArray = [];
					rows.forEach(function(e) {
						questionArray.push({
							"question": e.questionContent,
							"answers": JSON.parse(e.answersJSON),
							"type": e.questiontype
						});
					});
					// parse test and send test here.
					if (!isRandomized) {
						res.json({
							"error": null,
							"test": questionArray
						});
					} else {
						res.json({
							"error": null,
							"test": shuffle(questionArray)
						});
					}
				});
			} else {
				res.json({
					"error": "test not available"
				});
			}
		} else {
			res.json({
				"error": "test not found"
			});
		}
	});

});
// Check test status
app.post("/checkstatus/", function(req, res) {
	res.set("Access-Control-Allow-Origin", "*");
	var body = req.body;
	connection.query("SELECT * FROM tests WHERE P_Id=" + connection.escape(data) + " LIMIT 1", function(err, rows, fields) {
		res.writeHead(200);
		delete rows[0].P_Id;
		delete rows[0].O_Id;
		res.json(rows[0]);
	});
});
app.post("/gradetest/", function(req, res) {
	var body = req.body;
	// Get answers
	var answerArr = [];
	connection.query("SELECT * FROM questions WHERE test=" + connection.escape(body.testId), function(err, rows, fields) {
		rows.forEach(function(row) {
			answerArr.push(row);
		});
	});
	// Get student responses <-- implement after we manage to store student responses somehow.
	var studentRes = ["foo", "bar"];
	// populate array with T or F based on correct/incorrect
	var corrections = [];
	for (var i = 0; i < studentRes.length; i++) {
		if (e[i] == answerArr[i].correctAnswer) {
			corrections[i] = true;
		} else if (e[i] == null) {
			corrections[i] = null;
		} else {
			corrections[i] = false;
		}
	}
	// Add up all the points and store into DB.
	var totalPoints = 0;
	for (var i = 0; i < corrections.length; i++) {
		if (corrections[i]) {
			totalPoints += answerArr[i].fullPoints;
		} else if (corrections[i] == null) {
			totalPoints += answerArr[i].noAnswerPoints;
		} else {
			totalPoints -= answerArr[i].wrongAnswerPoints;
		}
	}
	// Mock storing into DB
	/*
	 * connection.query("INSERT INTO TABLE ??? VALUES (" + connection.escape(totalPoints) + ", " + connection.escape(body.studentId) + ")");
	 */
});

server = http.createServer(app);
// development only
// if ('development' == app.get('env')) {
// app.use(expressErrorHandler({server: server}));
// }

server.listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});