import { template } from 'underscore';
import { View } from 'backbone';
import { ENTER_KEY, ESCAPE_KEY } from 'app';

const todosTemplate =
  `
  <div class="view">
    <input class="toggle" type="checkbox" <%= completed ? 'checked' : '' %>>
    <label><%- title %></label>
    <button class="destroy"></button>
  </div>
  <input class="edit" value="<%- title %>">
  `;

class TodoView extends View {

  get tagName() {
    return 'li';
  }

  get template() {
    return template(todosTemplate);
  }

  // The DOM events specific to an item.
  get events() {
    return {
      'click .toggle': 'toggleCompleted',
      'dblclick label': 'edit',
      'click .destroy': 'clear',
      'keypress .edit': 'updateOnEnter',
      'keydown .edit': 'revertOnEscape',
      'blur .edit': 'close'
    };
  }

  // The TodoView listens for changes to its model, re-rendering. Since there's
  // a one-to-one correspondence between a **Todo** and a **TodoView** in this
  // app, we set a direct reference on the model for convenience.
  initialize() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  }

  // Re-render the titles of the todo item.
  render() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass('completed', this.model.get('completed'));

    this.toggleVisible();
    this.$input = this.$('.edit');
    return this;
  }

  toggleVisible() {
    this.$el.toggleClass('hidden', this.isHidden());
  }

  isHidden() {
    const isCompleted = this.model.get('completed');
    return ( // hidden cases only
    (!isCompleted && es6Todo.TodoFilter === 'completed') || (isCompleted && es6Todo.TodoFilter === 'active'));
  }

  // Toggle the `"completed"` state of the model.
  toggleCompleted() {
    this.model.toggle();
  }

  // Switch this view into `"editing"` mode, displaying the input field.
  edit() {
    this.$el.addClass('editing');
    this.$input.focus();
  }

  // Close the `"editing"` mode, saving changes to the todo.
  close() {
    const value = this.$input.val();
    const trimmedValue = value.trim();

    if (trimmedValue) {
      this.model.save({
        title: trimmedValue
      });

      if (value !== trimmedValue) {
        // Model values changes consisting of whitespaces only are not causing change to be triggered
        // Therefore we've to compare untrimmed version with a trimmed one to chech whether anything changed
        // And if yes, we've to trigger change event ourselves
        this.model.trigger('change');
      }
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
  }

  // If you hit `enter`, we're through editing the item.
  updateOnEnter(e) {
    if (e.keyCode === ENTER_KEY) {
      this.close();
    }
  }

  // If you're pressing `escape` we revert your change by simply leaving
  // the `editing` state.
  revertOnEscape(e) {
    if (e.which === ESCAPE_KEY) {
      this.$el.removeClass('editing');
      // Also reset the hidden input back to the original value.
      this.$input.val(this.model.get('title'));
    }
  }

  // Remove the item, destroy the model from *localStorage* and delete its view.
  clear() {
    this.model.destroy();
  }
}

export default TodoView;
