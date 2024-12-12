import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { deleteTodo, patchTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  isActive?: boolean;
  setErrorMessage: (message: string) => void;
  removeDeletedTodo: (id: number) => void;
  updateTodo: (newTodo: Todo) => void;
}

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, isActive, setErrorMessage, removeDeletedTodo, updateTodo }) => {
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(false);
    const [userAction, setUserAction] = useState(false);
    const [edit, setEdit] = useState(false);
    const [todoTitle, setTodoTitle] = useState(todo.title);

    const inputRef = useRef<HTMLInputElement>(null);
    const thisTodoDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (userAction) {
        setLoading(true);
        setErrorMessage('');

        patchTodo({ ...todo, completed: currentStatus, title: todoTitle })
          .then(item => {
            updateTodo(item);
            setEdit(false);
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => {
            setLoading(false);
            setUserAction(false);
          });
      }
    }, [currentStatus, userAction]);

    const toggleTodoStatus = () => {
      setCurrentStatus(!todo.completed);
      setUserAction(true);
    };

    const handleDeleteEvent = (id: number) => {
      const deletePromise = deleteTodo(id);

      setLoading(true);

      deletePromise
        .then(() => removeDeletedTodo(id))
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() => {
          setLoading(false);
        });
    };

    const handleUpdateTitle = (title: string) => {
      const newTitle = title.trim();

      switch (newTitle) {
        case '': {
          handleDeleteEvent(todo.id);
          break;
        }

        case todo.title: {
          setEdit(false);
          break;
        }

        default: {
          setUserAction(true);
          setTodoTitle(newTitle);
        }
      }
    };

    const onEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const inputElement = inputRef.current as HTMLInputElement;

        if (inputElement) {
          handleUpdateTitle(inputElement.value);
        }
      }
    };

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const originalTitle = todo.title;

        handleUpdateTitle(originalTitle);
        setTodoTitle(originalTitle);
      }
    };

    const onBlur = () => {
      const input = inputRef.current as HTMLInputElement;

      if (input) {
        document.removeEventListener('keydown', onEnter);
        document.removeEventListener('keyup', onEsc);
        handleUpdateTitle(input.value);
      }
    };

    const handleDoubleClick = () => {
      if (!edit) {
        setEdit(true);
        const thisTodoDiv = thisTodoDivRef.current as HTMLDivElement;

        if (thisTodoDiv) {
          document.addEventListener('keydown', onEnter);
          document.addEventListener('keyup', onEsc);
        }
      }
    };

    return (
      <div
        data-cy="Todo"
        ref={thisTodoDivRef}
        onDoubleClick={handleDoubleClick}
        className={cn('todo', {
          completed: todo.completed,
        })}
        key={todo.id}
      >
        {/* TODO STATUS */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={toggleTodoStatus}
            checked={todo.completed}
          />
        </label>

        {/* TODO TITLE / EDIT TODO FIELD */}
        {edit ? (
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            className="todo__title-field"
            value={todoTitle}
            onChange={e => setTodoTitle(e.target.value)}
            onBlur={onBlur}
            autoFocus
          />
        ) : (
          <span data-cy="TodoTitle" className="todo__title">
            {todoTitle}
          </span>
        )}

        {/* DELETE TODO */}
        {!edit && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteEvent(todo.id)}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': isActive || loading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
