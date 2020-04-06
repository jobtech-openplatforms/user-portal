import { PlatformData } from './PlatformData';
import { ApplicationData } from './ApplicationData';

export class TypedState {
    public isLoggedIn: boolean = false;
    public isChanged: boolean = false;
    public connectedPlatforms: PlatformData[] = [];
    public connectedApplications: ApplicationData[] = [];
}