import { ApplicationData } from './datatypes/ApplicationData';
import { ConnectionData } from './datatypes/ConnectionData';
import { ApplicationConnectionData } from './datatypes/ApplicationConnectionData';
import { Mutations } from './Mutations';

export namespace Actions {
    export class ActionBase {
        public type: string;
        constructor() {
            this.type = this.constructor.name;
        }
    }

    export class LoadInitialState extends ActionBase {
        constructor() { super(); }
        execute(context: any) {
            return new Promise((resolve, reject) => {
                console.log("inside LoadInitialState");
                // connected platforms
                const tmpConnection = new ConnectionData();
                tmpConnection.id = "freelancer.com";
                tmpConnection.logo = require("@/assets/images/platform-icons/freelancer.png");
                tmpConnection.name = "Freelancer";
                tmpConnection.isActive = true;
                tmpConnection.description =
                    "This is an awesome Gig platform, try it out, you will love it!";
                context.commit(new Mutations.AddPlatform(tmpConnection));

                const tmpConnection2 = new ConnectionData();
                tmpConnection2.id = "upwork.com";
                tmpConnection2.logo = require("@/assets/images/platform-icons/upwork.png");
                tmpConnection2.name = "Upwork";
                tmpConnection2.description =
                    "We are the best and biggest gig platform. Fuck the rest.";
                context.commit(new Mutations.AddPlatform(tmpConnection2));

                // app
                const tmpApp = new ApplicationData();
                tmpApp.id = "mydigitalbackpack.com";
                tmpApp.logo = require("@/assets/images/application-icons/my-digital-backpack.png");
                tmpApp.name = "My Digital Backpack";
                tmpApp.description =
                    "This application takes your data and make it awesome!";

                const appPlatformConnection = new ApplicationConnectionData();
                appPlatformConnection.id = "freelancer.com";
                appPlatformConnection.name = "Freelancer";
                appPlatformConnection.logo = require("@/assets/images/platform-icons/freelancer.png");
                appPlatformConnection.isActive = true;
                tmpApp.connectedPlatforms.push(appPlatformConnection);

                const appPlatformConnection2 = new ApplicationConnectionData();
                appPlatformConnection2.id = "upwork.com";
                appPlatformConnection2.name = "Upwork";
                appPlatformConnection2.logo = require("@/assets/images/platform-icons/upwork.png");
                appPlatformConnection2.isActive = true;
                tmpApp.connectedPlatforms.push(appPlatformConnection2);
                context.commit(new Mutations.AddApplication(tmpApp));
                resolve();
            });
        }
    }

    export class AddPlatform extends ActionBase {
        constructor(public platform: ConnectionData) { super(); }
        execute(context: any) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.AddPlatform(this.platform));
                resolve();
            });
        }
    }

    export class RemovePlatform extends ActionBase {
        constructor(public platformId: string) { super(); }
        execute(context: any) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.RemovePlatform(this.platformId));
                resolve();
            });
        }
    }

    export class SetPlatformActivity extends ActionBase {
        constructor(public platformId: string, public value: boolean) { super(); }
        execute(context: any) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.SetPlatformIsActive(this.platformId, this.value));
                resolve();
            });
        }
    }

    export class AddApplication extends ActionBase {
        constructor(public application: ApplicationData) { super(); }
        execute(context: any) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.AddApplication(this.application));
                resolve();
            });
        }
    }

    export class RemoveApplication extends ActionBase {
        constructor(public application: ApplicationData) { super(); }
        execute(context: any) {
            return new Promise((resolve, reject) => {
                context.commit(new Mutations.RemoveApplication(this.application));
                resolve();
            });
        }
    }
}
