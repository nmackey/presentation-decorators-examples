import { Router } from 'backbone';

class TodoRouter extends Router {
  get routes() {
    return {
      '*filter': 'setFilter'
    };
  }

  setFilter(param) {
    // Set the current filter to be used
    decoratorTodo.TodoFilter = param || '';

    // Trigger a collection filter event, causing hiding/unhiding
    // of the Todo view items
    decoratorTodo.todos.trigger('filter');
  }
}

export default TodoRouter;
