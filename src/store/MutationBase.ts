export class MutationBase {
    public type: string;
    constructor() {
        this.type = this.constructor.name;
    }
}