import { template, debounce, invoke } from 'underscore';
import { View } from 'backbone';
import TodoView from './View';
import { ENTER_KEY } from 'app';
import { el, on } from 'decorators/Utils';

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
@el('#todoapp')
class AppView extends View {

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.

  // Compile our stats template
  template = template(statsTemplate);

  // At initialization we bind to the relevant events on the `decoratorTodo.todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting todos that might be saved in *localStorage*.
  initialize() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.$todoList = this.$('#todo-list');

    this.listenTo(decoratorTodo.todos, 'add', this.addOne);
    this.listenTo(decoratorTodo.todos, 'reset', this.addAll);
    this.listenTo(decoratorTodo.todos, 'change:completed', this.filterOne);
    this.listenTo(decoratorTodo.todos, 'filter', this.filterAll);
    this.listenTo(decoratorTodo.todos, 'all', debounce(this.render, 0));

    decoratorTodo.todos.fetch({
      reset: true
    });
  }

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render() {
    const completed = decoratorTodo.todos.completed().length;
    const remaining = decoratorTodo.todos.remaining().length;

    if (decoratorTodo.todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.template({
        completed,
        remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter(`[href="#/${(decoratorTodo.TodoFilter || '')}"]`)
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  }

  // Add a single todo item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne(todo) {
    const view = new TodoView({
      model: todo
    });
    this.$todoList.append(view.render().el);
  }

  // Add all items in the **decoratorTodo.todos** collection at once.
  addAll() {
    this.$todoList.empty();
    decoratorTodo.todos.each(this.addOne, this);
  }

  filterOne(todo) {
    todo.trigger('visible');
  }

  filterAll() {
    decoratorTodo.todos.each(this.filterOne, this);
  }

  // Generate the attributes for a new Todo item.
  newAttributes() {
    return {
      title: this.$input.val().trim(),
      order: decoratorTodo.todos.nextOrder(),
      completed: false
    };
  }

  // If you hit return in the main input field, create new **Todo** model,
  // persisting it to *localStorage*.
  @on('keypress #new-todo')
  createOnEnter(e) {
    if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }

    decoratorTodo.todos.create(this.newAttributes());
    this.$input.val('');
  }

  // Clear all completed todo items, destroying their models.
  @on('click #clear-completed')
  clearCompleted() {
    invoke(decoratorTodo.todos.completed(), 'destroy');
    return false;
  }

  @on('click #toggle-all')
  toggleAllComplete() {
    const completed = this.allCheckbox.checked;

    decoratorTodo.todos.each(todo => {
      todo.save({
        completed
      });
    });
  }

  cleanUp() {
    decoratorTodo.todos.each(todo => {
      decoratorTodo.todos.remove(todo);
    });
    this.$footer.empty();
    this.stopListening();
  }
}

export default AppView;
