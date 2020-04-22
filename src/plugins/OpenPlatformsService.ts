
import { EventEmitter } from 'events';
import axios from 'axios';
import { ConnectAppState } from '@/datatypes/ConnectAppState';

export default {
    install(vue: any) {
        const openPlatforms = new OpenPlatformsService();
        vue.prototype.$openPlatforms = openPlatforms;
    }
}

export interface UserData {
    id: string;
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
                }).then(
                    (r) => {
                        if (r.data.state === 'Connected') {
                            window.location.href = callbackUri;
                        } else {
                            window.location.href = r.data.authorizationUri;
                        }
                    },
                    (e) => {
                        reject({ e: 'Could not connect to Open Platforms:' + callbackUri })
                    }
                );
        });
    }

    getUser(accessToken: any) {
        return new Promise<UserData>((resolve, reject) => {
            axios.get(process.env.VUE_APP_CV_DATA_API_PATH + 'User',
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(
                    (r) => {
                        resolve(r.data);
                    },
                    (e) => {
                        reject({ e: 'Could not get user from Open Platforms' })
                    }
                );
        });
    }

    async completeConnectionFlow(accessToken: any, connectState: ConnectAppState) {
        try {
            const userData: UserData = await this.getUser(accessToken);
            let callbackurl = connectState.callbackurl;
            let parameters = ['result=completed', 'openplatformsuserid=' + userData.id];
            if (callbackurl.indexOf('?') > -1) {
                callbackurl += '&' + parameters.join('&');
            } else {
                callbackurl += '?' + parameters.join('&');
            }

            if (window.opener === null) {
                localStorage.removeItem('loginState');
                window.location.href = connectState.callbackurl as string;
                return;
            }

            const result = await axios.get(callbackurl,
                {
                    headers: {
                        Accept: 'application/json'
                    }
                }
            );
            localStorage.removeItem('loginState');
            window.close();

        } catch (err) {
            throw ({ e: 'Could not register connection at ' + connectState.app + ". Error: " + err });
        }
    }

    cancelConnectionFlow(connectState: ConnectAppState) {
        localStorage.removeItem('loginState');
        if (window.opener === null) {
            let callbackurl = connectState.callbackurl;
            let parameters = ['result=cancelled'];
            if (callbackurl.indexOf('?') > -1) {
                callbackurl += '&' + parameters.join('&');
            } else {
                callbackurl += '?' + parameters.join('&');
            }
            window.location.href = connectState.callbackurl as string;
        }
        else {
            window.close();
        }
    }
}
