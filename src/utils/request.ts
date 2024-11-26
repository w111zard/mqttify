class Request {
    constructor(
        private readonly _name: string,
        private readonly _topic: string,
        private readonly _data: object,
    ) {}

    get name(): string {
        return this._name;
    }

    get data(): object {
        return this._data;
    }

    get topic(): string {
        return this._topic;
    }

    static isRequest(obj: unknown): obj is Request {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        if (Object.keys(obj).length !== 3) {
            return false;
        }
        return 'name' in obj && 'topic' in obj && 'data' in obj;
    }
}


export default Request;