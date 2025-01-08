import { getContext, setContext } from "svelte";
import { Habit } from "./Habit.svelte";
import { Todo } from "./Todo.svelte";

export class HabitState {
  habits = $state<Habit[]>([]);

  constructor() {}

  add(habit: Habit) {
    this.habits.push(habit);
  }

  remove(id: number) {
    this.habits = this.habits.filter((habit) => habit.id !== id);
  }
}

const HABIT_KEY = Symbol("HABIT");

export function setHabitState() {
  return setContext(HABIT_KEY, new HabitState());
}

export function getHabitState() {
  return getContext<ReturnType<typeof setHabitState>>(HABIT_KEY);
}

// TODO STATE

export class TodoState {
  todos = $state<Todo[]>([]);

  constructor() {}

  add(todo: Todo) {
    this.todos.push(todo);
  }

  remove(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  toggle(id: number) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      const foundTodo = this.todos[index].clone();
      foundTodo.completed = !foundTodo.completed;
      this.todos[index] = foundTodo.clone();
    }
  }

  update(todo: Todo) {
    this.todos[todo.id] = todo;
  }
}

const TODO_KEY = Symbol("TODO");

export function setTodoState() {
  return setContext(TODO_KEY, new TodoState());
}

export function getTodoState() {
  return getContext<ReturnType<typeof setTodoState>>(TODO_KEY);
}
