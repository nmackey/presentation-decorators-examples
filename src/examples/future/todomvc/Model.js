import { Model, Collection } from 'backbone';
import Store from 'backboneLocalstorage';
import { defaults, comparator } from 'decorators/Utils';

@defaults({
  title: '',
  completed: false
})
export class TodoModel extends Model {
  // Toggle the `completed` state of this todo item.
  toggle() {
    this.save({
      completed: !this.get('completed')
    });
  }
}

@comparator('order')
export class TodoCollection extends Collection {
  // Reference to this collection's model.
  model = TodoModel;

  // Save all of the todo items under this example's namespace.
  localStorage = new Store('todos-backbone');

  // Filter down the list of all todo items that are finished.
  completed() {
    return this.where({
      completed: true
    });
  }

  // Filter down the list to only todo items that are still not finished.
  remaining() {
    return this.where({
      completed: false
    });
  }

  // We keep the Todos in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder() {
    return this.length ? this.last().get('order') + 1 : 1;
  }
}
