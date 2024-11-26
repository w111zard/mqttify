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

    static isRequestGroup(obj: unknown): obj is RequestGroup {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        if (Object.keys(obj).length !== 2) {
            return false;
        }
        if (!('name' in obj) || !('requests' in obj) || !Array.isArray(obj.requests)) {
            return false;
        }
        for (const request of obj.requests) {
            if (!Request.isRequest(request)) {
                return false;
            }
        }
        return true;
    }
}

export default RequestGroup;