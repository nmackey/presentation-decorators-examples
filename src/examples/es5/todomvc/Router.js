import { Router } from 'backbone';

var TodoRouter = Router.extend({
  routes: {
    '*filter': 'setFilter'
  },

  setFilter: function(param) {
    // Set the current filter to be used
    es5Todo.TodoFilter = param || '';

    // Trigger a collection filter event, causing hiding/unhiding
    // of the Todo view items
    es5Todo.todos.trigger('filter');
  }
});

module.exports = TodoRouter;
