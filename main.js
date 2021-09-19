// classes & enums ----------------------------------------------------------------------
class TaskTypes {
	static get EASY() {
		return "easy";
	}
	static get NICE() {
		return "nice";
	}
	static get HARD() {
		return "hard";
	}
}

class User {
	constructor(name) {
		this.statistics = {
			"user": name,
			"tasks":
			{
				"addition": {
					"nice": {
						"correct": 0,
						"incorrect": 0,
						"timing": 0
					}
				},
				"subtraction": {
					"nice": {
						"correct": 0,
						"incorrect": 0,
						"timing": 0
					}
				},
				"multiplication": {
					"easy": {
						"correct": 0,
						"incorrect": 0,
						"timing": 0
					},
					"nice": {
						"correct": 0,
						"incorrect": 0,
						"timing": 0
					},
					"hard": {
						"correct": 0,
						"incorrect": 0,
						"timing": 0
					}
				},
				"division": {
					"easy": {
						"correct": 0,
						"incorrect": 0,
						"timing": 0
					},
					"hard": {
						"correct": 0,
						"incorrect": 0,
						"timing": 0
					}
				}
			}
		}
	}

	GetName() {
		return this.statistics.user;
	}

	GetStatistics() {
		return this.statistics;
	}

	GetAmountOfTasksSolved() {
		let solved = 0;
		for(const task in this.statistics.tasks) {
			for(let type in this.statistics.tasks[task]) {
				solved += this.GetTasks(task, type, true);
				solved += this.GetTasks(task, type, false);
			}
		}
		return solved;
	}

	GetTasksSolvedOfType(operator, type) {
		return this.statistics.tasks[operator][type]["correct"] + this.statistics.tasks[operator][type]["incorrect"];
	}

	GetAmountOfTasksSolvedCorrect() {
		let solved = 0;
		for(const task in this.statistics.tasks) {
			for(let type in this.statistics.tasks[task]) {
				solved += this.GetTasks(task, type, true);
			}
		}
		return solved;
	}

	GetAmountOfTasksSolvedIncorrect() {
		let solved = 0;
		for(const task in this.statistics.tasks) {
			for(let type in this.statistics.tasks[task]) {
				solved += this.GetTasks(task, type, false);
			}
		}
		return solved;
	}

	GetTasks(operator, type, correct) {
		return this.statistics.tasks[operator][type][(correct ? "correct" : "incorrect")];
	}

	GetTaskTiming(operator, type) {
		return this.statistics.tasks[operator][type]["timing"];
	}

	AddSolvedTask(operator, type, correct, startTime) {
		this.statistics.tasks[operator][type][(correct ? "correct" : "incorrect")]++;
		this.statistics.tasks[operator][type]["timing"] += (Date.now() - startTime);
	}
}

class NumberGenerator {
	constructor() {}

	GetRandomNumber(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

class OperatorGenerator extends NumberGenerator {
	constructor() {
		super();
	}

	GetRandomNumber(min, max) {
		return super.GetRandomNumber(min, max);
	}
}

class IntegerGenerator extends NumberGenerator {
	constructor() {
		super();
		this.niceMultiplicationNumberWasAboveTen = false;
		this.niceMultiplicationFirstCall = true;
		this.divisionFirstCall = true;
		this.divisor = 0;
	}

	GetRandomNumber(operator, taskType) {
		switch(operator) {
		case Operators.ADDITION:
			return super.GetRandomNumber(1, 100);
		case Operators.SUBTRACTION:
			// TODO this generates negative results
			return super.GetRandomNumber(1, 100);
		case Operators.MULTIPLICATION:
			switch (taskType) {
			case TaskTypes.EASY:
				return super.GetRandomNumber(1, 10);
			case TaskTypes.NICE:
				this.GenerateRandomOrderForNiceMultiplication();
				if(this.niceMultiplicationNumberWasAboveTen) {
					this.niceMultiplicationNumberWasAboveTen = false;
					return super.GetRandomNumber(1, 10);
				}
				else {
					this.niceMultiplicationNumberWasAboveTen = true;
					return super.GetRandomNumber(10, 100);
				}
			case TaskTypes.HARD:
				return super.GetRandomNumber(1, 100);
			default:
				alert("You broke the number generation (multiplication). Please reload the Page!");
			}
		case Operators.DIVISION:
			if(this.divisionFirstCall) {
				this.divisionFirstCall = false;
				let divisorMax;
				if(taskType == TaskTypes.EASY)
					divisorMax = 10;
				else if(taskType == TaskTypes.HARD)
					divisorMax = 30; // TODO: see features
				const divisor = super.GetRandomNumber(2, divisorMax);
				this.divisor = divisor;
				const result = divisor * super.GetRandomNumber(1, 10);
				return result;
			}
			else {
				this.divisionFirstCall = true;
				return this.divisor;
			}
		default:
			alert("You broke the number generation (everything). Please reload the Page!");
		}
	}

	GenerateRandomOrderForNiceMultiplication() {
		if (this.niceMultiplicationFirstCall) {
			this.niceMultiplicationNumberWasAboveTen = (Math.random() < 0.5 ? true : false);
			this.niceMultiplicationFirstCall = false;
		}
		else {
			this.niceMultiplicationFirstCall = true;
		}
	}

	GenerateDivision
}

class Operators {
	constructor(operators) {
		this.operatorGenerator = new OperatorGenerator();
		this.operators = this.InitializeOperators(operators);
	}

	// after execution, the operators array will consist of string describing the operators
	InitializeOperators(operators) {
		let selectedOperators = [];
		for(const op in operators) {
			const value = operators[op];
			if(value === true) {
				selectedOperators.push(op);
			}
		}
		return selectedOperators;
	}

	// returns "addition", "subtraction", etc..
	GetNewOperator() {
		return this.operators[this.operatorGenerator.GetRandomNumber(0, this.operators.length - 1)];
	}

	static get ADDITION() {
		return "addition";
	}
	static get SUBTRACTION() {
		return "subtraction";
	}
	static get MULTIPLICATION() {
		return "multiplication";
	}
	static get DIVISION() {
		return "division";
	}

	static get ADDITION_SYMBOL() {
		return "+";
	}
	static get SUBTRACTION_SYMBOL() {
		return "-";
	}
	static get MULTIPLICATION_SYMBOL() {
		return "*";
	}
	static get DIVISION_SYMBOL() {
		return "/";
	}
}

class Task {
	constructor(configuration) {
		this.operators = new Operators(configuration["operators"]);
		this.types = configuration["taskTypes"];
		this.random = new IntegerGenerator();
		this.x = 0;
		this.y = 0;
		this.operator = "operator";
		this.type = "nice";
		this.startTime = 0;
	}

	GetNewTask() {
		// first: operator
		this.operator = this.operators.GetNewOperator();

		// second: type
		this.type = this.types[this.operator];

		// third: numbers
		this.x = this.random.GetRandomNumber(this.operator, this.type);
		this.y = this.random.GetRandomNumber(this.operator, this.type);

		// fourth: result
		this.result = this.GetNewResult();

		// fifth: timing
		this.startTime = Date.now();

		// sixth: log the task for debugging (and cheating)
		console.log(`Task (${this.type}): ${this.x} ${this.GetOperatorSymbol()} ${this.y} = ${this.result}`);
	}

	GetNewResult() {
		if(this.operator === Operators.ADDITION) {
			return this.x + this.y;
		}
		else if(this.operator === Operators.SUBTRACTION) {
			return this.x - this.y;
		}
		else if(this.operator === Operators.MULTIPLICATION) {
			return this.x * this.y;
		}
		else if(this.operator === Operators.DIVISION) {
			return this.x / this.y;
		}
	}

	CompareResults(userResult) {
		return userResult === this.result;
	}

	GetOperatorSymbol() {
		switch (this.operator) {
		case Operators.ADDITION:
			return Operators.ADDITION_SYMBOL;
		case Operators.SUBTRACTION:
			return Operators.SUBTRACTION_SYMBOL;
		case Operators.MULTIPLICATION:
			return Operators.MULTIPLICATION_SYMBOL;
		case Operators.DIVISION:
			return Operators.DIVISION_SYMBOL;
		}
	}

	GetCurrentTask() {
		return {x: this.x, y: this.y, operator: this.operator, type: this.type, result: this.result};
	}
}

class TaskGenerator {
	constructor(configuration) {
		this.configuration = configuration;
		this.user = new User(configuration.username);
		this.task = new Task(configuration);
		this.task.GetNewTask();
	}

	GetUser() {
		return this.user;
	}

	GetTask() {
		return this.task;
	}

	GetConfiguration() {
		return this.configuration;
	}

	GenerateNewTask() {
		this.task.GetNewTask();
	}
}

// global -------------------------------------------------------------------------------
document.getElementById("result").addEventListener("keydown", function(event) {
	if(event.code === "Enter")
		next();
});
document.getElementsByName("state:task").forEach(function(e) {
	e.style.display = "none";
});
document.getElementsByName("state:stats").forEach(function(e) {
	e.style.display = "none";
});
hideAdditionalConfiguration();



var tg;

/*
* TODO:
  main features done!

  Features:
    nice animation when solving a task -> green checkmark or red x
	cookies to remember configuration (?)
	send stats to server
	advanced config:
	- chance for each operator
	- maximum task number
	- individual config for number ranges on mul and div
*/
// functions ----------------------------------------------------------------------------
function start() {
	const config = validateConfiguration();
	if(config === false) {
		alert("Please choose a proper configuration!");
		return;
	}
	tg = new TaskGenerator(config);

	document.getElementsByName("state:start").forEach(function(e) {
		e.style.display = "none";
	});

	document.getElementsByName("state:task").forEach(function(e) {
		e.style.display = "block";
	});
	displayTask();
}

function hideAdditionalConfiguration() {
	document.getElementById("multiplication_type").style.visibility = "hidden";
	document.getElementById("multiplication_type").style.height = "0px";
	document.getElementById("division_type").style.visibility = "hidden";
	document.getElementById("division_type").style.height = "0px";
}

// returns either the config or false if the config is invalid
function validateConfiguration() {
	let validOperatorSelection = false;
	let operators = {};
	document.getElementsByName("operator_selection").forEach(function(e) {
		operators[e.id] = e.checked;
		if(e.checked) {
			validOperatorSelection = true;
		}
	});

	let taskTypes = {addition: "nice", subtraction: "nice", multiplication: "nice", division: "nice"};
	let validMultiplicationTypeSelection = false;
	if (operators[Operators.MULTIPLICATION]) {
		document.getElementsByName("multiplication_type").forEach(function (e) {
			if (e.checked) {
				taskTypes["multiplication"] = e.value;
				validMultiplicationTypeSelection = true;
			}
		});
	}
	else {
		validMultiplicationTypeSelection = true;
	}

	let validDivisionTypeSelection = false;
	if (operators[Operators.DIVISION]) {
		document.getElementsByName("division_type").forEach(function (e) {
			if (e.checked) {
				taskTypes["division"] = e.value;
				validDivisionTypeSelection = true;
			}
		});
	}
	else {
		validDivisionTypeSelection = true;
	}

	let validUsernameInput = false;
	let username = document.getElementById("username").value;
	let validUsernameRegex = /[a-zA-Z0-9]/i;
	if(username.match(validUsernameRegex) !== null) {
		validUsernameInput = true;
	}

	if(validOperatorSelection && validMultiplicationTypeSelection && validDivisionTypeSelection && validUsernameInput) {
		console.log("+--- Configuration ---");
		console.log(`| Username: ${username}`);
		console.log("| Operators:", operators);
		console.log("| Task Types: ", taskTypes);
		console.log("+---------------------");
		return {username: username, operators: operators, taskTypes: taskTypes};
	}
	else {
		return false;
	}
}

function next() {
	displayResult();
	document.getElementById("result").value = "";
	tg.GenerateNewTask();
	displayTask();
}

function end() {
	document.getElementsByName("state:task").forEach(function(e) {
		e.style.display = "none";
	});
	document.getElementsByName("state:stats").forEach(function(e) {
		e.style.display = "block";
	});
	console.log(tg.GetUser().GetStatistics());
	drawStatisticsTable(tg.GetConfiguration());
}

function displayTask() {
	document.getElementById("number1").value = tg.GetTask().x;
	document.getElementById("number2").value = tg.GetTask().y;
	document.getElementById("operator").value = tg.GetTask().GetOperatorSymbol();
}

function displayResult() {
	const userResult = validateResultInput();
	let text;
	const task = tg.GetTask();
	if(task.CompareResults(userResult)) {
		tg.GetUser().AddSolvedTask(task.operator, task.type, true, tg.GetTask().startTime);
		text = "Correct!";
	}
	else {
		tg.GetUser().AddSolvedTask(task.operator, task.type, false, tg.GetTask().startTime);
		text = `Wrong! Was ${tg.GetTask().GetNewResult()}. You entered ${userResult}.`;
	}
	document.getElementById("correct").innerHTML = text;
}

function validateResultInput() {
	const userResult = parseInt(document.getElementById("result").value, 10);	// TODO this parses stuff like "123w" as 123 -> use regex
	if(Number.isSafeInteger(userResult)) {
		return userResult;
	}
	else {
		return "something else";
	}
}

function showMultiplicationSelection() {
	const multiplicationSelectionHeight = "120px";	// this looks good
	if(document.getElementById("multiplication").checked) {
		document.getElementById("multiplication_type").style.height = multiplicationSelectionHeight;
		document.getElementById("multiplication_type").style.visibility = "visible";
	}
	else {
		document.getElementById("multiplication_type").style.height = "0px";
		document.getElementById("multiplication_type").style.visibility = "hidden";
	}
}

function showDivisionSelection() {
	const multiplicationSelectionHeight = "80px";	// this looks good
	if(document.getElementById("division").checked) {
		document.getElementById("division_type").style.height = multiplicationSelectionHeight;
		document.getElementById("division_type").style.visibility = "visible";
	}
	else {
		document.getElementById("division_type").style.height = "0px";
		document.getElementById("division_type").style.visibility = "hidden";
	}
}

function drawStatisticsTable(config) {
	const user = tg.GetUser();
	const tableHeader = document.getElementById("stats-table-header");
	const tableRowCorrect = document.getElementById("stats-table-correct");
	const tableRowInorrect = document.getElementById("stats-table-incorrect");
	const tableRowTiming = document.getElementById("stats-table-timing");
	for(const [op, enabled] of Object.entries(config["operators"])) {
		if(enabled === true) {
			const taskType = config["taskTypes"][op];

			let header = document.createElement("th");
			header.textContent = op;
			header.classList = "th-operator";
			if(op === "multiplication" || op === "division")
				header.textContent += " (" + taskType + ")";
			tableHeader.appendChild(header);

			let correctData = document.createElement("td");
			correctData.classList = "td-operator";
			correctData.textContent = user.GetTasks(op, taskType, true);
			tableRowCorrect.appendChild(correctData);

			let incorrectData = document.createElement("td");
			incorrectData.classList = "td-operator";
			incorrectData.textContent = user.GetTasks(op, taskType, false);
			tableRowInorrect.appendChild(incorrectData);

			let timingData = document.createElement("td");
			timingData.classList = "td-operator";
			const solvedTasks = user.GetTasksSolvedOfType(op, taskType);
			if(solvedTasks != 0) {
				let timing = user.GetTaskTiming(op, taskType) / user.GetTasksSolvedOfType(op, taskType);
				timingData.textContent = (timing / 1000).toFixed(1);
			}
			else {
				timingData.textContent = "-";
			}
			tableRowTiming.appendChild(timingData);

		}
	}
}
