import { Actions } from './Actions';

export class ActionBase {
    public type: string = "";
    constructor() {
        Object.getOwnPropertyNames(Actions).forEach((className) => {
            if ((<any>Actions)[className] === this.constructor) {
                this.type = className;
            }
        });

        if (this.type === "") {
            this.type = this.constructor.name;
            console.warn("Action class ", this.type, " was not in Actions namespace, will not work if code is minified");
        }
    }
}