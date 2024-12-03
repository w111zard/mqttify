function* generateId(): Generator<number> {
  let id = 0;
  while (true) {
    yield id++;
  }
}

const generator = generateId();

class Operation {
  private readonly _id: number;

  constructor(
    private readonly _name: string,
  ) {
    this._id = generator.next().value;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}

export default Operation;