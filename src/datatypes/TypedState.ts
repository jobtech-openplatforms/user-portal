import { ConnectionData } from './ConnectionData';
import { ApplicationData } from './ApplicationData';

export class TypedState {
    public isLoggedIn: boolean = false;
    public isChanged: boolean = false;
    public connectedPlatforms: ConnectionData[] = [];
    public connectedApplications: ApplicationData[] = [];
}