import { ApplicationData } from './ApplicationData'
import { PlatformData } from './PlatformData'

export interface ConnectAppState {
    type: 'CONNECT';
    route: string;
    app: ApplicationData;
    platform: PlatformData;
    callbackurl: string;
    permissions: number;
}
