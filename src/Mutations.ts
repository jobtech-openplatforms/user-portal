import { ApplicationData } from './datatypes/ApplicationData';
import { ConnectionData } from './datatypes/ConnectionData';
import { ApplicationConnectionData } from './datatypes/ApplicationConnectionData';
import { TypedState } from './TypedState';

export namespace Mutations {
    export class MutationBase {
        public type: string;
        constructor() {
            this.type = this.constructor.name;
        }
    }

    export class AddPlatform extends MutationBase {
        constructor(public platform: ConnectionData) { super(); }
        execute(state: TypedState) {
            // TODO: add platform to all applications
            state.connectedPlatforms.push(this.platform);
        }
    }

    export class RemovePlatform extends MutationBase {
        constructor(public platformId: string) { super(); }
        execute(state: TypedState) {
            // TODO: remove platform from all applications
            const index = state.connectedPlatforms.map(function (x) { return x.id; }).indexOf(this.platformId);
            if (index > -1) {
                state.connectedPlatforms.splice(index, 1);
            }
        }
    }

    export class SetPlatformIsActive extends MutationBase {
        constructor(public platformId: string, public value: boolean) { super(); }
        execute(state: TypedState) {
            const index = state.connectedPlatforms.map(function (x) { return x.id; }).indexOf(this.platformId);
            state.connectedPlatforms[index].isActive = this.value;
            // TODO: disable platform from all applications?
        }
    }

    export class AddApplication extends MutationBase {
        constructor(public application: ApplicationData) { super(); }
        execute(state: TypedState) {
            // TODO: make sure all plattforms are added
            state.connectedApplications.push(this.application);
        }
    }

    export class RemoveApplication extends MutationBase {
        constructor(public application: ApplicationData) { super(); }
        execute(state: TypedState) {
            const index = state.connectedApplications.indexOf(this.application);
            if (index > -1) {
                state.connectedApplications.splice(index, 1);
            }
        }
    }
}
