import { Mutations } from './Mutations';

export class MutationBase {
    public type: string = "";
    constructor() {
        Object.getOwnPropertyNames(Mutations).forEach((className) => {
            if ((<any>Mutations)[className] === this.constructor) {
                this.type = className;
            }
        });

        if (this.type === "") {
            this.type = this.constructor.name;
            console.warn("Mutation class ", this.type, " was not in Mutations namespace, will not work if code is minified");
        }
    }
}