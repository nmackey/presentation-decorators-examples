import { template, debounce, invoke } from 'underscore';
import { View } from 'backbone';
import TodoView from './View';
import { ENTER_KEY } from 'app';

const statsTemplate =
  `
    <span id="todo-count"><strong><%= remaining %></strong> <%= remaining == 1 ? 'item' : 'items' %> left</span>
    <ul id="filters">
      <li>
        <a class="selected" href="#/">All</a>
      </li>
      <li>
        <a href="#/active">Active</a>
      </li>
      <li>
        <a href="#/completed">Completed</a>
      </li>
    </ul>
    <% if ( completed ) { %>
    <button id="clear-completed">Clear completed</button>
    <% } %>
  `;

// Our overall **AppView** is the top-level piece of UI.
var AppView = View.extend({

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: '#todoapp',

  // Compile our stats template
  template: template(statsTemplate),

  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // At initialization we bind to the relevant events on the `es5Todo.todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting todos that might be saved in *localStorage*.
  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.$todoList = this.$('#todo-list');

    this.listenTo(es5Todo.todos, 'add', this.addOne);
    this.listenTo(es5Todo.todos, 'reset', this.addAll);
    this.listenTo(es5Todo.todos, 'change:completed', this.filterOne);
    this.listenTo(es5Todo.todos, 'filter', this.filterAll);
    this.listenTo(es5Todo.todos, 'all', debounce(this.render, 0));

    es5Todo.todos.fetch({
      reset: true
    });
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    var completed = es5Todo.todos.completed().length;
    var remaining = es5Todo.todos.remaining().length;

    if (es5Todo.todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.template({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (es5Todo.TodoFilter || '') + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Add a single todo item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function(todo) {
    var view = new TodoView({
      model: todo
    });
    this.$todoList.append(view.render().el);
  },

  // Add all items in the **es5Todo.todos** collection at once.
  addAll: function() {
    this.$todoList.empty();
    es5Todo.todos.each(this.addOne, this);
  },

  filterOne: function(todo) {
    todo.trigger('visible');
  },

  filterAll: function() {
    es5Todo.todos.each(this.filterOne, this);
  },

  // Generate the attributes for a new Todo item.
  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: es5Todo.todos.nextOrder(),
      completed: false
    };
  },

  // If you hit return in the main input field, create new **Todo** model,
  // persisting it to *localStorage*.
  createOnEnter: function(e) {
    if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }

    es5Todo.todos.create(this.newAttributes());
    this.$input.val('');
  },

  // Clear all completed todo items, destroying their models.
  clearCompleted: function() {
    invoke(es5Todo.todos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    es5Todo.todos.each(function(todo) {
      todo.save({
        completed: completed
      });
    });
  },

  cleanUp: function() {
    es5Todo.todos.each(todo => {
      es5Todo.todos.remove(todo);
    });
    this.$footer.empty();
    this.stopListening();
  }
});

module.exports = AppView;
