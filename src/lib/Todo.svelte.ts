export class Todo {
  name: string = $state("To-Do");
  done: boolean = $state(false);
  id: number;

  constructor(name: string) {
    this.id = Date.now();
    this.name = name;
  }

  clone() {
    const clone = new Todo(this.name);
    clone.id = this.id;
    clone.done = this.done;

    return clone;
  }
}
