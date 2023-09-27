import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

let todoList = [
  { id: 1, title: "todo1", completed: false },
  { id: 2, title: "todo2", completed: false },
  { id: 3, title: "todo3", completed: false },
  { id: 4, title: "todo4", completed: false },
];

const todos = new Hono();

todos.get("/", (c) => c.json(todoList));

todos.post(
  "/",
  zValidator(
    "form",
    z.object({
      title: z.string({ required_error: "title is required" }),
    }),
    (result, c) => {
      if (!result.success) {
        return c.text("invalid", 400);
      }
    }
  ),
  async (c) => {
    const { title } = c.req.valid("form");
    const newTodo = {
      id: todoList.length + 1,
      title: title,
      completed: false,
    };
    todoList = [...todoList, newTodo];

    return c.json(newTodo, 201);
  }
);

todos.put("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === Number(id));
  if (!todo) {
    return c.json({ message: "Not found" }, 404);
  }

  const params = (await c.req.json()) as {
    title?: string;
    completed?: boolean;
  };
  todoList = todoList.map((todo) => {
    if (todo.id === Number(id)) {
      return {
        ...todo,
        ...params,
      };
    } else {
      return todo;
    }
  });

  return new Response(null, { status: 204 });
});

todos.delete("/:id", (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === Number(id));
  if (!todo) {
    return c.json({ message: "Not found" }, 404);
  }

  todoList = todoList.filter((todo) => todo.id !== Number(id));

  return new Response(null, { status: 204 });
});

export default todos;
