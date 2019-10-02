export class ActionBase {
    public type: string;
    constructor() {
        this.type = this.constructor.name;
    }
}