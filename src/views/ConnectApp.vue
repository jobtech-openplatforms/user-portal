<template>
  <div class="connect-app-start-page page-content">
    <div v-if="!isDataFetched">
      <p>Loading...</p>
    </div>
    <div v-if="isDataError">
      <p>Something went wrong, error message:</p>
      <p class="error-message">{{errorMessage}}</p>
    </div>
    <div v-if="isDataFetched">
      <div class="centered-content">
        <ConnectionDiagram :state="appState" />
        <h2>Step 1: Connect {{appState.platform.name}}</h2>
        <div v-if="appState.platform.authMechanism ==='Email'">
          <div v-if="emailValidationState=='START'">
            <p>Enter the email adress you use on {{appState.platform.name}}</p>
            <input type="email" v-model="email" required />
            <p v-if="emailErrorMessage" class="error-message">{{emailErrorMessage}}</p>
            <button
              class="button is-primary is-large"
              @click="onStartEmailVerification()"
            >Validate email</button>
          </div>
          <div v-if="emailValidationState=='WAITING'">
            <p>
              To verify your email, we have sent you a mail with a verification link.
              Click on this link and then press the button to continue
            </p>
            <button class="button is-primary is-large" @click="onContinueEmail()">Email is validated</button>
          </div>
        </div>

        <div v-if="appState.platform.authMechanism ==='Oauth2'">
          <p>You will now be redirected to {{appState.platform.name}} where you need to allow that Open Platforms can access your data</p>
        </div>
        <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
        <button class="button is-primary is-large" @click="onContinueOath()">Continue</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


<script lang="ts">
import ConnectionDiagram from '../components/ConnectionDiagram.vue'
import { Component, Prop, Vue } from "vue-property-decorator";
import { TypedState } from "../datatypes/TypedState";
import { ConnectAppState } from "../datatypes/ConnectAppState";
import { ActionBase } from "../store/ActionBase";
import { Actions } from "../store/Actions";
import axios from 'axios';
import { APIPlatformData, APIApplicationsData } from '../datatypes/APIdata';
import { PlatformData } from '../datatypes/PlatformData';
import { ApplicationData } from '../datatypes/ApplicationData';
import { OpenPlatformsService } from '../plugins/OpenPlatformsService';
import AuthService from '../plugins/AuthService';

@Component({
  components: {    ConnectionDiagram

  }
})
export default class ConnectApp extends Vue {
  public isDataFetched = false;
  public isDataError = false;
  public errorMessage = '';
  public email = '';
  public emailErrorMessage = '';
  public emailValidationState: 'START' | 'WAITING' = 'START';

  public appState!: ConnectAppState;
  private auth: AuthService = (<any>this).$auth;
  private openPlatforms: OpenPlatformsService = (<any>this).$openPlatforms;

  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  private mounted() {
    this.appState = JSON.parse(localStorage.getItem('loginState') as string);
    if (this.appState) {
      this.isDataFetched = true;
    }
    console.log('mounted', this.$route, this.$route.query, this.$route.path);
  }

  public onStartEmailVerification() {
    this.emailValidationState = 'WAITING';
  }

  public onContinueEmail() {
    console.log('onContinueEmail');
  }

  public onContinueOath() {
    const baseUrl = window.location.host;
    this.auth.getAccessToken().then((accessToken: any) => {
      this.openPlatforms.startOauthConnection(
        accessToken,
        this.appState.platform.platformId,
        this.appState.app.appId,
        baseUrl + '/completed-connection'
      );
    });
  }

  public onCancel() {
    // TODO: leave open platforms either by going back to returnUrl
  }
}
</script>