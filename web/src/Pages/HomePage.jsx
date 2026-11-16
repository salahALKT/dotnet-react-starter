import { useLoaderData, useFetcher } from 'react-router';
import Todo from '../Components/Todo';
import TodoForm from '../Components/TodoForm';

const HomePage = () => {
  const todos = useLoaderData();
  const fetcher = useFetcher();

  const addTodo = (title, description) => {
    fetcher.submit(
      { intent: 'create', title, description },
      { method: 'post' }
    );
  };

  const toggleTodo = (id, isComplete) => {
    fetcher.submit(
      { intent: 'update', todoId: id, isComplete: !isComplete },
      { method: 'post' }
    );
  };

  const deleteTodo = (id) => {
    fetcher.submit(
      { intent: 'delete', todoId: id },
      { method: 'post' }
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Todo List</h2>

        <div className="mb-6">
          <TodoForm onSubmit={(title, description) => addTodo(title, description)} />
        </div>

        <div className="space-y-3">
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              title={todo.title}
              description={todo.description}
              isComplete={todo.isComplete}
              onToggle={() => toggleTodo(todo.id, todo.isComplete)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;