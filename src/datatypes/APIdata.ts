export class APIdata {
    platforms: APIPlatformData[] = [];
    apps: APIApplicationsData[] = [];
}

export class APIPlatformData {
    public platformId = '';
    public logoUrl = '';
    public name = '';
    public description = '';
    public websiteurl = '';
    public authMechanism: 'Email' | 'Oauth2' = 'Email';
    public isConnected = false;
}

export class APIApplicationsData {
    public appId?: string; // TODO: used for legacy
    public applicationId = '';
    public logoUrl = '';
    public name = '';
    public description = '';
    public websiteurl = '';
    public connectedPlatforms: string[] = [];
}
