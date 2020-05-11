
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
    startEmailConnection(accessToken: any, platformId: string, applicationId: string, email: string, permissions: number) {
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_CV_DATA_API_PATH + 'PlatformUser/connect-user-to-email-platform',
                {
                    platformUserEmailAddress: email,
                    platformId,
                    applicationId,
                    platformDataClaim: this.getDataClaimFromPermission(permissions)
                },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(
                    (r) => {
                        resolve(r.data.state === 'AwaitingEmailVerification');
                    },
                    (e) => {
                        reject({ e: 'Could not connect to Open Platforms', error: e });
                    }
                );
        });
    }

    checkIfEmailIsAlreadyValidated(accessToken: any, email: string) {
        return new Promise((resolve, reject) => {
            axios.get(process.env.VUE_APP_CV_DATA_API_PATH + 'User',
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(
                    (r) => {
                        const userEmails: Array<{ email: string, state: string }> = r.data.userEmails;
                        const isVerified = userEmails.find((e) => {
                            return e.email === email && e.state === 'Verified';
                        }) !== undefined;
                        if (isVerified) {
                            resolve();
                        } else {
                            reject({ e: 'Email is not verified yet.' });
                        }
                    },
                    (e) => {
                        reject({ e: 'Could check ig email was verified yet.', error: e });
                    }
                );
        });
    }

    startOauthConnection(accessToken: any, platformId: string, applicationId: string, callbackUri: string, permissions: number) {
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_CV_DATA_API_PATH + 'PlatformUser/start-connect-user-to-oauth-platform',
                {
                    callbackUri,
                    platformId,
                    applicationId,
                    platformDataClaim: this.getDataClaimFromPermission(permissions)
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

    getDataClaimFromPermission(permissions: number) {
        let dataClaim: "Aggregated" | "Full" = "Aggregated";
        if (permissions === 2) {
            dataClaim = "Full";
        }
        return dataClaim;
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

    async connectUser(accessToken: any, connectState: ConnectAppState) {
        const userData: UserData = await this.getUser(accessToken);
        let callbackurl = connectState.callbackurl;
        let parameters = ['openplatformsuserid=' + userData.id, 'requestid=' + connectState.requestId];
        if (callbackurl.indexOf('?') > -1) {
            callbackurl += '&' + parameters.join('&');
        } else {
            callbackurl += '?' + parameters.join('&');
        }
        const result = await axios.get(callbackurl,
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        );
        return;
    }

    completeConnectionFlow(connectState: ConnectAppState) {
        localStorage.removeItem('loginState');
        if (window.opener === null) {
            let returnurl = connectState.returnurl;
            let parameters = ['result=completed', 'requestid=' + connectState.requestId];
            if (returnurl.indexOf('?') > -1) {
                returnurl += '&' + parameters.join('&');
            } else {
                returnurl += '?' + parameters.join('&');
            }
            window.location.href = returnurl;
        }
        else {
            window.close();
        }
    }

    cancelConnectionFlow(connectState: ConnectAppState) {
        localStorage.removeItem('loginState');
        if (window.opener === null) {
            let returnurl = connectState.returnurl;
            let parameters = ['result=cancelled', 'requestid=' + connectState.requestId];
            if (returnurl.indexOf('?') > -1) {
                returnurl += '&' + parameters.join('&');
            } else {
                returnurl += '?' + parameters.join('&');
            }
            window.location.href = returnurl;
        }
        else {
            window.close();
        }
    }

    verifyEmail(promptId: string) {
        const url = 'emailvalidation/callback?prompt_id=' + promptId + '&accept=true';
        return axios.get(
            process.env.VUE_APP_CV_DATA_API_PATH + url,
            {
                headers: {
                    Accept: 'application/json',
                }
            });
    }
}
