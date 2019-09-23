import { ConnectionData } from './datatypes/ConnectionData';
import { ApplicationData } from './datatypes/ApplicationData';

export class TypedState {
    public isLoggedIn: boolean = false;
    public connectedPlatforms: ConnectionData[] = [];
    public connectedApplications: ApplicationData[] = [];
}