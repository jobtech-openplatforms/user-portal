import { ApplicationData } from '../datatypes/ApplicationData';
import { PlatformData } from '../datatypes/PlatformData';
import { Mutations } from './Mutations';
import { ActionBase } from './ActionBase';
import { TypedState } from '@/datatypes/TypedState';
import { TypedGetters, TypedContext } from './TypedContext';
import AuthService from '@/plugins/AuthService';
import axios from 'axios';
import { AssetsManager } from '@/plugins/AssetsManager';
import { APIdata } from '@/datatypes/APIdata';


export namespace Actions {
    // export var TestAction = TestActions.TestAction; // example of adding actions from other namespace/file

    export class Login extends ActionBase {
        constructor(private auth: AuthService) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                this.auth.login();
                resolve();
            });
        }
    }

    export class LoginCompleted extends ActionBase {
        constructor() { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.SetLoginStatus(true));
                resolve();
            });
        }
    }

    export class Logout extends ActionBase {
        constructor(private auth: AuthService) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                this.auth.logOut();
                context.commit(new Mutations.ResetState());
                context.commit(new Mutations.SetLoginStatus(false))
                resolve();
            });
        }
    }

    export class LoadInitialState extends ActionBase {
        constructor(private auth: AuthService) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.ResetState());
                this.auth.getAccessToken().then((accessToken) => {
                    axios.get(process.env.VUE_APP_CV_DATA_API_PATH + 'Platform/connection-state', {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${accessToken}`
                        }
                    }).then(
                        (r) => {
                            const data = <APIdata>r.data;
                            console.log("API result success:", data);
                            data.platforms.forEach((p, i) => {
                                const newPlatform = PlatformData.fromAPIData(p);
                                context.commit(new Mutations.AddPlatform(newPlatform));
                            });
                            data.apps.forEach((a, i) => {
                                const newApp = ApplicationData.fromAPIData(a, data.platforms);
                                context.commit(new Mutations.AddApplication(newApp));
                            });
                            context.commit(new Mutations.SetStateAsUnchanged());
                            resolve();
                        },
                        (error) => {
                            console.log("API result fail:", error);
                            context.commit(new Mutations.SetStateAsUnchanged());
                            reject();
                        }
                    );
                });

            });
        }
    }

    export class AddPlatform extends ActionBase {
        constructor(public platform: PlatformData) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.AddPlatform(this.platform));
                resolve();
            });
        }
    }

    export class RemovePlatform extends ActionBase {
        constructor(public platformId: string) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.RemovePlatform(this.platformId));
                resolve();
            });
        }
    }

    export class SetPlatformActive extends ActionBase {
        constructor(public platformId: string, public value: boolean) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.SetPlatformIsActive(this.platformId, this.value));
                resolve();
            });
        }
    }

    export class AddApplication extends ActionBase {
        constructor(public application: ApplicationData) { super(); }
        execute(context: TypedContext, getters: TypedGetters) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.AddApplication(this.application));
                resolve();
            });
        }
    }

    export class RemoveApplication extends ActionBase {
        constructor(public application: ApplicationData) { super(); }
        execute(context: TypedContext, getters: TypedGetters) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.RemoveApplication(this.application));
                resolve();
            });
        }
    }

    export class SetApplicationConnectionActive extends ActionBase {
        constructor(public applicationId: string, public platformId: string, public value: boolean) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                const platform = context.state.connectedPlatforms.find(p => p.platformId === this.platformId);
                if (platform) {
                    if (this.value === true && platform.isConnected === false) { // TODO: auto-enable platform should require a confirmation
                        context.commit(new Mutations.SetPlatformIsActive(this.platformId, true));
                    }
                    context.commit(new Mutations.SetApplicationConnectionActive(this.applicationId, this.platformId, this.value));
                } else {
                    reject();
                }

                resolve();
            });
        }
    }

    export class SaveState extends ActionBase {
        constructor(public state: TypedState, public auth: AuthService) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                const stateUpdate = {
                    platformConnectionStateUpdates: <Array<any>>[]
                }
                this.state.connectedPlatforms.forEach(platform => {
                    const connectedApps: string[] = [];
                    this.state.connectedApplications.forEach(a => {
                        a.connectedPlatforms.forEach(p => {
                            if (p.platformId === platform.platformId && p.isConnected) {
                                connectedApps.push(a.appId);
                            }
                        });
                    });
                    const platformInfo = {
                        platformId: platform.platformId,
                        removeConnection: platform.isConnected === false,
                        connectedApps: connectedApps
                    }
                    stateUpdate.platformConnectionStateUpdates.push(platformInfo);
                    if (platformInfo.removeConnection) {
                        delete platformInfo.connectedApps;
                    }
                });

                this.auth.getAccessToken().then((accessToken) => {
                    axios.post(process.env.VUE_APP_CV_DATA_API_PATH + 'Platform/connection-state',
                        stateUpdate,
                        {
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then((data) => {
                            console.log(data);
                            // TODO reset app state based on returned data
                            context.commit(new Mutations.SetStateAsUnchanged());
                            resolve();
                        });
                });
            });
        }
    }
}
