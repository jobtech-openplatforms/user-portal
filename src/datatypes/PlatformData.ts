import { APIdata, APIPlatformData } from './APIdata';
import { AssetsManager } from '@/plugins/AssetsManager';

export class PlatformData {
    public static fromAPIData(data: APIPlatformData) {
        const newData = new PlatformData();
        newData.platformId = data.platformId;
        console.log(data);
        newData.logoUrl = data.logoUrl || AssetsManager.getLogoPath(data.name);
        newData.name = data.name;
        newData.description = data.description;
        newData.url = data.websiteurl;
        newData.authMechanism = data.authMechanism;
        newData.isConnected = data.isConnected || false;
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
