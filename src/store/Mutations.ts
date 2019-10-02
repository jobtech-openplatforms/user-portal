import { ApplicationData } from '../datatypes/ApplicationData';
import { ConnectionData } from '../datatypes/ConnectionData';
import { TypedState } from '../datatypes/TypedState';
import { MutationBase } from './MutationBase';

export namespace Mutations {
    export class SetLoginStatus extends MutationBase {
        constructor(public value: boolean) { super(); }
        execute(state: TypedState) {
            state.isLoggedIn = this.value;
        }
    }

    export class SetStateAsUnchanged extends MutationBase {
        constructor() { super(); }
        execute(state: TypedState) {
            state.isChanged = false;
        }
    }
    export class ResetState extends MutationBase {
        constructor() { super(); }
        execute(state: TypedState) {
            state.connectedPlatforms = [];
            state.connectedApplications = [];
            state.isChanged = false;
        }
    }

    export class AddPlatform extends MutationBase {
        constructor(public platform: ConnectionData) { super(); }
        execute(state: TypedState) {
            // TODO: add platform to all applications
            state.connectedPlatforms.push(this.platform);
            state.isChanged = true;
        }
    }

    export class RemovePlatform extends MutationBase {
        constructor(public platformId: string) { super(); }
        execute(state: TypedState) {
            // TODO: remove platform from all applications
            const index = state.connectedPlatforms.map(function (x) { return x.id; }).indexOf(this.platformId);
            if (index > -1) {
                state.connectedPlatforms.splice(index, 1);
                state.isChanged = true;
            }
        }
    }

    export class SetPlatformIsActive extends MutationBase {
        constructor(public platformId: string, public value: boolean) { super(); }
        execute(state: TypedState) {
            const index = state.connectedPlatforms.map(function (x) { return x.id; }).indexOf(this.platformId);
            state.connectedPlatforms[index].isActive = this.value;

            // inactivate all platform for all applications
            if (this.value === false) {
                state.connectedApplications.forEach((app) => {
                    app.connectedPlatforms.forEach((platform) => {
                        if (platform.id === this.platformId) {
                            platform.isActive = this.value;
                        }
                    })
                });
            }
            state.isChanged = true;
        }
    }

    export class SetApplicationConnectionActive extends MutationBase {
        constructor(public applicationId: string, public platformId: string, public value: boolean) { super(); }
        execute(state: TypedState) {
            state.connectedApplications.forEach((app) => {
                if (app.id === this.applicationId) {
                    app.connectedPlatforms.forEach((platform) => {
                        if (platform.id === this.platformId) {
                            platform.isActive = this.value;
                        }
                    })
                }
            });
            state.isChanged = true;
        }
    }


    export class AddApplication extends MutationBase {
        constructor(public application: ApplicationData) { super(); }
        execute(state: TypedState) {
            // TODO: make sure all plattforms are added
            state.connectedApplications.push(this.application);
            state.isChanged = true;
        }
    }

    export class RemoveApplication extends MutationBase {
        constructor(public application: ApplicationData) { super(); }
        execute(state: TypedState) {
            const index = state.connectedApplications.indexOf(this.application);
            if (index > -1) {
                state.connectedApplications.splice(index, 1);
                state.isChanged = true;
            }
        }
    }
}
