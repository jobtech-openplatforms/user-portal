import { ApplicationConnectionData } from './ApplicationConnectionData';
import { APIApplicationsData, APIPlatformData } from './APIdata';
import { AssetsManager } from '@/plugins/AssetsManager';

export class ApplicationData {
    public static fromAPIData(data: APIApplicationsData, platforms: APIPlatformData[]) {
        const newData = new ApplicationData();
        newData.appId = data.applicationId || data.appId as string; // TODO: remove legacy
        newData.logoUrl = data.logoUrl || AssetsManager.getLogoPath(data.name);
        newData.name = data.name;
        newData.description = data.description;
        newData.url = data.websiteurl;

        let connections: ApplicationConnectionData[] = [];
        if (data.connectedPlatforms) {
            connections = data.connectedPlatforms.map((platformId) => {
                const platform = platforms.find((p) => p.platformId === platformId) as APIPlatformData;
                const connection = new ApplicationConnectionData();
                connection.isConnected = true;
                connection.logoUrl = platform.logoUrl;
                connection.name = platform.name;
                connection.platformId = platform.platformId;
                return connection;
            });
        }
        newData.connectedPlatforms = connections;
        return newData;
    }

    public appId = '';
    public logoUrl = '';
    public name = '';
    public description = '';
    public url = '';
    public connectedPlatforms: ApplicationConnectionData[] = [];
}
