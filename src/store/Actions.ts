import { ApplicationData } from '../datatypes/ApplicationData';
import { ConnectionData } from '../datatypes/ConnectionData';
import { Mutations } from './Mutations';
import { ApplicationConnectionData } from '@/datatypes/ApplicationConnectionData';
import { ActionBase } from './ActionBase';
import { TypedState } from '@/datatypes/TypedState';
import { TypedGetters, TypedContext } from './TypedContext';
import VueRouter from 'vue-router';
import AuthService from '@/plugins/AuthService';
import axios from 'axios';
import { AssetsManager } from '@/plugins/AssetsManager';
import { APIdata } from '@/datatypes/APIdata';


export namespace Actions {
    // export var TestAction = TestActions.TestAction; // example of adding actions from other namesapce/file

    export class Login extends ActionBase {
        constructor(private auth: AuthService) { super(); }
        execute(context: TypedContext) {
            return new Promise((resolve, reject) => {
                this.auth.login();
                console.log("login2")
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
                    axios.get(process.env.VUE_APP_CV_DATA_API_PATH, {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${accessToken}`
                        }
                    }).then(
                        (r) => {
                            const data = <APIdata>r.data;
                            console.log("API result success:", data);
                            data.platforms.forEach((p, i) => {
                                const newConnection = new ConnectionData();
                                newConnection.id = p.platformId;
                                newConnection.logo = p.logo || AssetsManager.getLogoPath(p.name);
                                newConnection.name = p.name;
                                newConnection.isActive = p.isConnected;
                                newConnection.description = p.description || "";
                                newConnection.url = p.url || "";
                                context.commit(new Mutations.AddPlatform(newConnection));
                            });
                            data.apps.forEach((a, i) => {
                                const newApp = new ApplicationData();
                                newApp.id = a.appId;
                                newApp.logo = a.logo || AssetsManager.getLogoPath(a.name);
                                newApp.name = a.name;
                                newApp.description = a.description || "";
                                newApp.url = a.url || "";
                                newApp.connectedPlatforms = data.platforms.map((p, i) => {
                                    return {
                                        id: p.platformId,
                                        logo: p.logo || AssetsManager.getLogoPath(p.name),
                                        name: p.name,
                                        isActive: a.connectedPlatforms.indexOf(p.platformId) > -1
                                    }
                                })

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
        constructor(public platform: ConnectionData) { super(); }
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
                const platform = context.state.connectedPlatforms.find(p => p.id === this.platformId);
                if (platform) {
                    if (this.value === true && platform.isActive === false) { // TODO: auto-enable platform should require a confirmation
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
                            if (p.id === platform.id && p.isActive) {
                                connectedApps.push(a.id);
                            }
                        });
                    });
                    const platformInfo = {
                        platformId: platform.id,
                        removeConnection: platform.isActive === false,
                        connectedApps: connectedApps
                    }
                    stateUpdate.platformConnectionStateUpdates.push(platformInfo);
                    if (platformInfo.removeConnection) {
                        delete platformInfo.connectedApps;
                    }
                });

                this.auth.getAccessToken().then((accessToken) => {
                    axios.post(process.env.VUE_APP_CV_DATA_API_PATH,
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
