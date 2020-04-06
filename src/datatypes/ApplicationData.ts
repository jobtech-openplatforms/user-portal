import { ApplicationConnectionData } from './ApplicationConnectionData';
import { APIApplicationsData, APIPlatformData } from './APIdata';

export class ApplicationData {
    public static fromAPIData(data: APIApplicationsData, platforms: APIPlatformData[]) {
        const newData = new ApplicationData();
        newData.appId = data.appId;
        newData.logoUrl = data.logoUrl;
        newData.name = data.name;
        newData.description = data.description;
        newData.url = data.url;
        newData.connectedPlatforms = data.connectedPlatforms.map((platformId) => {
            const platform = platforms.find((p) => p.platformId === platformId) as APIPlatformData;
            const connection = new ApplicationConnectionData();
            connection.isConnected = true;
            connection.logoUrl = platform.logoUrl;
            connection.name = platform.name;
            connection.platformId = platform.platformId;
            return connection;
        });
        return newData;
    }

    public appId = '';
    public logoUrl = '';
    public name = '';
    public description = '';
    public url = '';
    public connectedPlatforms: ApplicationConnectionData[] = [];
}
