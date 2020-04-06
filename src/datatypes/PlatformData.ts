import { APIdata, APIPlatformData } from './APIdata';

export class PlatformData {
    public static fromAPIData(data: APIPlatformData) {
        const newData = new PlatformData();
        newData.platformId = data.platformId;
        newData.logoUrl = data.logoUrl;
        newData.name = data.name;
        newData.description = data.description;
        newData.url = data.url;
        newData.authMechanism = data.authMechanism;
        return newData;
    }

    public platformId = '';
    public logoUrl = '';
    public name = '';
    public description = '';
    public url = '';
    public authMechanism: 'Email' | 'Oauth2' = 'Email';
    public isConnected = false;
}
