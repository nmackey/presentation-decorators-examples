import { template } from 'underscore';
import { View } from 'backbone';
import { ENTER_KEY, ESCAPE_KEY } from 'app';
import { tagName, on } from 'decorators/Utils';

const todosTemplate =
  `
  <div class="view">
    <input class="toggle" type="checkbox" <%= completed ? 'checked' : '' %>>
    <label><%- title %></label>
    <button class="destroy"></button>
  </div>
  <input class="edit" value="<%- title %>">
  `;

@tagName('li')
class TodoView extends View {

  template = template(todosTemplate);

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
    (!isCompleted && decoratorTodo.TodoFilter === 'completed') || (isCompleted && decoratorTodo.TodoFilter === 'active'));
  }

  // Toggle the `"completed"` state of the model.
  @on('click .toggle')
  toggleCompleted() {
    this.model.toggle();
  }

  // Switch this view into `"editing"` mode, displaying the input field.
  @on('dblclick label')
  edit() {
    this.$el.addClass('editing');
    this.$input.focus();
  }

  // Close the `"editing"` mode, saving changes to the todo.
  @on('blur .edit')
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
  @on('keypress .edit')
  updateOnEnter(e) {
    if (e.keyCode === ENTER_KEY) {
      this.close();
    }
  }

  // If you're pressing `escape` we revert your change by simply leaving
  // the `editing` state.
  @on('keydown .edit')
  revertOnEscape(e) {
    if (e.which === ESCAPE_KEY) {
      this.$el.removeClass('editing');
      // Also reset the hidden input back to the original value.
      this.$input.val(this.model.get('title'));
    }
  }

  // Remove the item, destroy the model from *localStorage* and delete its view.
  @on('click .destroy')
  clear() {
    this.model.destroy();
  }
}

export default TodoView;
