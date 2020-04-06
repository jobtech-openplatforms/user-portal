export class APIdata {
    platforms: APIPlatformData[] = [];
    apps: APIApplicationsData[] = [];
}

export class APIPlatformData {
    public platformId = '';
    public logoUrl = '';
    public name = '';
    public description = '';
    public url = '';
    public authMechanism: 'Email' | 'Oauth2' = 'Email';
    public isConnected = false;
}

export class APIApplicationsData {
    public appId = '';
    public logoUrl = '';
    public name = '';
    public description = '';
    public url = '';
    public connectedPlatforms: string[] = [];
}
