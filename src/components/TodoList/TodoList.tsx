import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  setErrorMessage: (message: string) => void;
  removeDeletedTodo: (id: number) => void;
  updateTodo: (newTodo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setErrorMessage,
  removeDeletedTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            setErrorMessage={setErrorMessage}
            removeDeletedTodo={removeDeletedTodo}
            updateTodo={updateTodo}
            key={todo.id}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isActive={true}
          setErrorMessage={setErrorMessage}
          removeDeletedTodo={removeDeletedTodo}
          updateTodo={updateTodo}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
