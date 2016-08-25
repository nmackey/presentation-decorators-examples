import { Router } from 'backbone';

class TodoRouter extends Router {
  get routes() {
    return {
      '*filter': 'setFilter'
    };
  }

  setFilter(param) {
    // Set the current filter to be used
    es6Todo.TodoFilter = param || '';

    // Trigger a collection filter event, causing hiding/unhiding
    // of the Todo view items
    es6Todo.todos.trigger('filter');
  }
}

export default TodoRouter;
