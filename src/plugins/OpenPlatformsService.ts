
import { EventEmitter } from 'events';
import axios from 'axios';

export default {
    install(vue: any) {
        const openPlatforms = new OpenPlatformsService();
        vue.prototype.$openPlatforms = openPlatforms;
    }
}

export class OpenPlatformsService extends EventEmitter {
    startOauthConnection(accessToken: any, platformId: string, applicationId: string, callbackUri: string) {
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_CV_DATA_API_PATH + 'PlatformUser/start-connect-user-to-oauth-platform',
                {
                    callbackUri,
                    platformId,
                    applicationId
                },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((r) => {
                    if (r.data.state === 'Connected') {
                    } else {
                        window.location.href = r.data.authorizationUri;
                        resolve(r.data);
                    }
                });
        });
    }
}