import { CreateTodo, PREFIX, Todo, UpdateTodo } from './model';
import app from '..';

const env = getMiniflareBindings();
const seed = async () => {
	const todoList: Todo[] = [
		{ id: '1', title: 'Learning Hono', completed: false },
		{ id: '2', title: 'Watch the movie', completed: true },
		{ id: '3', title: 'Buy milk', completed: false },
	];
	for (const todo of todoList) {
		await env.HONO_TODO.put(`${PREFIX}${todo.id}`, JSON.stringify(todo));
	}
};

describe('Todos API', () => {
	beforeEach(() => {
		seed();
	});
	test('Todo 一覧を取得する', async () => {
		const res = await app.fetch(new Request('http://localhost/api/todos'), env);
		expect(res.status).toBe(200);

		const body = await res.json();
		expect(body).toEqual([
			{ id: '1', title: 'Learning Hono', completed: false },
			{ id: '2', title: 'Watch the movie', completed: true },
			{ id: '3', title: 'Buy milk', completed: false },
		]);
	});
	test('Todo を作成する', async () => {
		const newTodo: CreateTodo = { title: 'new-todo' };
		const res1 = await app.fetch(
			new Request('http://localhost/api/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTodo),
			}),
			env
		);
		expect(res1.status).toBe(201);
		const body = await res1.json();
		expect(body).toEqual({
			id: expect.any(String),
			title: 'new-todo',
			completed: false,
		});

		const res2 = await app.fetch(new Request('http://localhost/api/todos'), env);
		const list = await res2.json();
		expect(list).toEqual([
			{ id: '1', title: 'Learning Hono', completed: false },
			{ id: '2', title: 'Watch the movie', completed: true },
			{ id: '3', title: 'Buy milk', completed: false },
			{ id: expect.any(String), title: 'new-todo', completed: false },
		]);
	});

	test('Todo を更新する', async () => {
		const updateTodo: UpdateTodo = { completed: true };
		const res1 = await app.fetch(
			new Request('http://localhost/api/todos/3', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateTodo),
			}),
			env
		);
		expect(res1.status).toBe(204);

		const res2 = await app.fetch(new Request('http://localhost/api/todos'), env);
		const list = await res2.json();
		expect(list).toEqual([
			{ id: '1', title: 'Learning Hono', completed: false },
			{ id: '2', title: 'Watch the movie', completed: true },
			{ id: '3', title: 'Buy milk', completed: true },
		]);
	});

	test('Todo を削除する', async () => {
		const res1 = await app.fetch(
			new Request('http://localhost/api/todos/2', {
				method: 'DELETE',
			}),
			env
		);
		expect(res1.status).toBe(204);

		const res2 = await app.fetch(new Request('http://localhost/api/todos'), env);
		const list = await res2.json();
		expect(list).toEqual([
			{ id: '1', title: 'Learning Hono', completed: false },
			{ id: '3', title: 'Buy milk', completed: false },
		]);
	});
});
