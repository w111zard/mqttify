class Request {
    constructor(
        private readonly _name: string,
        private readonly _data: object,
    ) {}

    get name(): string {
        return this._name;
    }

    get message(): object {
        return this._data;
    }
}

export default Request;