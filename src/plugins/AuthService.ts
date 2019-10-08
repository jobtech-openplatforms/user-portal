
import auth0 from 'auth0-js'
import { EventEmitter } from 'events';

// exchange the object with your own from the setup step above.
const webAuth = new auth0.WebAuth({
    domain: process.env.VUE_APP_AUTH_DOMAIN,// domain + '.auth0.com',
    audience: process.env.VUE_APP_AUTH_AUDIENCE,//"cvdata.se",
    redirectUri: process.env.VUE_APP_AUTH_REDIRECT,//baseUrl + '/cvdataauth',
    clientID: process.env.VUE_APP_AUTH_CLIENT_ID,//clientId,
    responseType: 'id_token token',
    scope: 'openid profile name'
})

const localStorageKey = 'loggedIn';
const loginEvent = 'loginEvent';

export default class AuthService extends EventEmitter {
    idToken = null;
    profile = null;
    tokenExpiry = 0;
    accessToken = null;
    accessTokenExpiry = 0;

    // Starts the user login flow
    login(customState: any = null) {
        return new Promise((resolve, reject) => {
            console.log("login2a")
            webAuth.authorize({
                appState: customState
            });
        });
    }

    // Handles the callback request from Auth0
    handleAuthentication() {
        return new Promise((resolve, reject) => {
            webAuth.parseHash((err, authResult) => {
                if (err || !authResult) {
                    reject(err);
                } else {
                    this.localLogin(authResult);
                    resolve(authResult.idToken);
                }
            });
        });
    }

    localLogin(authResult: any) {
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;

        // Convert the JWT expiry time from seconds to milliseconds
        this.tokenExpiry = new Date((<any>this.profile).exp * 1000).getTime();

        this.accessToken = authResult.accessToken;
        this.accessTokenExpiry = new Date(Date.now() + authResult.expiresIn * 1000).getTime();

        localStorage.setItem(localStorageKey, 'true');

        this.emit(loginEvent, {
            loggedIn: true,
            profile: authResult.idTokenPayload,
            state: authResult.appState || {}
        });
    }

    renewTokens() {
        return new Promise((resolve, reject) => {
            if (localStorage.getItem(localStorageKey) !== "true") {
                return reject("Not logged in");
            }

            webAuth.checkSession({}, (err, authResult) => {
                if (err) {
                    reject(err);
                } else {
                    this.localLogin(authResult);
                    resolve(authResult);
                }
            });
        });
    }

    logOut() {
        localStorage.removeItem(localStorageKey);

        this.idToken = null;
        this.tokenExpiry = 0;
        this.profile = null;
        this.accessToken = null;
        this.accessTokenExpiry = 0;

        // webAuth.logout({
        //     returnTo: window.location.origin
        // });

        this.emit(loginEvent, { loggedIn: false });
    }

    isAuthenticated() {
        return (
            this.tokenExpiry !== null &&
            Date.now() < this.tokenExpiry &&
            localStorage.getItem(localStorageKey) === 'true'
        );
    }

    isAccessTokenValid() {
        return (
            this.accessToken &&
            this.accessTokenExpiry &&
            Date.now() < this.accessTokenExpiry
        );
    }

    getAccessToken() {
        return new Promise((resolve, reject) => {
            if (this.isAccessTokenValid()) {
                resolve(this.accessToken);
            } else {
                this.renewTokens().then((authResult: any) => {
                    resolve(authResult.accessToken);
                }, reject);
            }
        });
    }
}