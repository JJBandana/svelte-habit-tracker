export class Todo {
  id: number;
  title;
  completed;
  dueDate: string;
  priority: number;

  constructor(
    title: string,
    id: number = Date.now(),
    dueDate: string = "",
    priority: number = 0,
    completed: boolean = false
  ) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }

  clone() {
    const clone = new Todo(this.title, this.id, this.dueDate, this.priority);
    clone.completed = this.completed;
    return clone;
  }
}
