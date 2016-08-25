import ES5TodoView from 'examples/es5/todomvc/AppView';
import ES5Router from 'examples/es5/todomvc/Router';
import ES5TodoModel from 'examples/es5/todomvc/Model';
import ES6TodoView from 'examples/es6/todomvc/AppView';
import ES6Router from 'examples/es6/todomvc/Router';
import { TodoCollection as ES6TodoCollection } from 'examples/es6/todomvc/Model';
import DecoratorTodoView from 'examples/future/todomvc/AppView';
import DecoratorRouter from 'examples/future/todomvc/Router';
import { TodoCollection as DecoratorTodoCollection } from 'examples/future/todomvc/Model';
import Backbone from 'backbone';
import { readonly } from 'core-decorators';

import 'style.css';

export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;

let todoAppView;

window.es5TodoApp = function es5TodoApp() {
	if (todoAppView) {
		todoAppView.cleanUp();
	}
	window.es5Todo = {
		TodoFilter: '',
		todos: new ES5TodoModel.Collection()
	};
  // Initialize routing and start Backbone.history()
	new ES5Router();
	window.location = '#';
	if (!Backbone.History.started) {
		Backbone.history.start();
	}

	// Initialize the application view
	todoAppView = new ES5TodoView();
	document.getElementById('todoWrapper').className = '';
};

window.es6TodoApp = function es6TodoApp() {
	if (todoAppView) {
		todoAppView.cleanUp();
	}
	window.es6Todo = {
		TodoFilter: '',
		todos: new ES6TodoCollection()
	};
  // Initialize routing and start Backbone.history()
	new ES6Router();
	window.location = '#';
	if (!Backbone.History.started) {
		Backbone.history.start();
	}

	// Initialize the application view
	todoAppView = new ES6TodoView();
	document.getElementById('todoWrapper').className = '';
};

window.decoratorsTodoApp = function decoratorsTodoApp() {
	if (todoAppView) {
		todoAppView.cleanUp();
	}
	window.decoratorTodo = {
		TodoFilter: '',
		todos: new DecoratorTodoCollection()
	};
  // Initialize routing and start Backbone.history()
	new DecoratorRouter();
	window.location = '#';
	if (!Backbone.History.started) {
		Backbone.history.start();
	}

	// Initialize the application view
	todoAppView = new DecoratorTodoView();
	document.getElementById('todoWrapper').className = '';
};

class Test {
	@readonly
	grade = 'B';
}

const mathTest = new Test();
mathTest.grade = 'A';
