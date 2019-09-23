import { ApplicationConnectionData } from './ApplicationConnectionData';

export class ApplicationData {
    public id = '';
    public logo = '';
    public name = '';
    public description = '';
    public connectedPlatforms: ApplicationConnectionData[] = [];
}
