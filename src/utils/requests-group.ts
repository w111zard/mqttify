import Request from './request';

class RequestGroup {
    constructor(
        private readonly _name: string,
        private readonly _requests: Request[] = [],
    ) {}

    addRequest(request: Request) {
        this._requests.push(request);
    }

    get name(): string {
        return this._name;
    }

    get requests(): Request[] {
        return this._requests;
    }
}

export default RequestGroup;