import { TodoItem } from "@/app/todo-item";
import React from "react";

async function getTodos(): Promise<
  { id: number; title: string; completed: boolean }[]
> {
  const res = await fetch("http://0.0.0.0:8787/api/todos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const todos = await res.json();
  return todos;
}

export const TodoList: React.FC = async () => {
  const todos = await getTodos();

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
