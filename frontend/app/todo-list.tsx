import { TodoItem } from "@/app/todo-item";
import React from "react";

async function getTodos(): Promise<
  { id: number; title: string; completed: boolean }[]
> {
  console.log(process.env.API_ENDPOINT);
  const res = await fetch(`${process.env.API_ENDPOINT}/api/todos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-cache",
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
