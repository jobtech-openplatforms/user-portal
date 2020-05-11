<template>
  <div class="connect-app-start-page page-content">
    <div v-if="!isDataFetched && !isDataError">
      <p>Loading...</p>
    </div>
    <div v-if="isDataError">
      <p class="error-message">{{errorMessage}}</p>
      <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
    </div>
    <div v-if="isDataFetched">
      <div class="centered-content">
        <h2 v-if="appState.platform.authMechanism ==='Email' && emailValidationState=='START'">Step 1: Connect <strong>{{appState.platform.name}}</strong></h2>
        <h2 v-if="appState.platform.authMechanism ==='Email' && emailValidationState=='WAITING'">Step 2: Click on the email link</h2>
        <h2 v-if="appState.platform.authMechanism ==='Oauth2'">Connect {{appState.platform.name}}</h2>

        <ConnectionDiagram :state="appState" />

        <div v-if="appState.platform.authMechanism ==='Email'">
          <div v-if="emailValidationState=='START'">
            <p>Enter the email address you use on {{appState.platform.name}}</p>
            <div class="email-input">
              <input type="email" v-model="email" required />
              <p v-if="emailErrorMessage" class="error-message">{{emailErrorMessage}}</p>
            </div>
            <div>
              <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
              <button
                class="button is-primary is-large"
                @click="onStartEmailVerification()"
              >Validate email</button>
            </div>
          </div>
          <div v-if="emailValidationState=='WAITING'">
            <p class="email-sent-text">
              To verify your email adress, we have sent a mail to
              <strong>{{email}}</strong> with a verification link.
              Click on the link in the email and then continue.
            </p>
            <p v-if="emailErrorMessage" class="error-message">
              {{emailErrorMessage}}
              <br />
              <a class="resend-email-link" @click="onResendEmail()">Resend verification email</a>
            </p>
            <div class="buttons">
              <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
              <button class="button is-primary is-large" @click="onContinueEmail()">Email is validated</button>
            </div>
          </div>
        </div>

        <div v-if="appState.platform.authMechanism ==='Oauth2'">
          <h2>Connect {{appState.platform.name}}</h2>
          <p>You will now be redirected to {{appState.platform.name}} where you need to allow that Open Platforms can access your data</p>
          <div class="buttons">
            <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
            <button class="button is-primary is-large" @click="onContinueOath()">Continue</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-input
{
  margin:40px 0 20px;
}

.email-sent-text{
  margin:60px;
}

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
import LoginNeededModal from '../components/LoginNeededModal.vue';

@Component({
  components: {    ConnectionDiagram

  }
})
export default class ConnectAppAdd extends Vue {
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
    } else {
      this.isDataError = true;
      this.errorMessage = 'Could not find connection data, please try again.';
    }
  }

  public onStartEmailVerification() {
    this.emailErrorMessage = '';
    if (this.validateEmail(this.email)) {
      const loadingComponent = this.$buefy.loading.open({});
      this.auth.getAccessToken().then(
        (accessToken: any) => {
          this.openPlatforms.startEmailConnection(
            accessToken,
            this.appState.platform.platformId,
            this.appState.app.appId,
            this.email
          ).then(
            (isWaitingForEmailVerification) => {
              loadingComponent.close();
              if (isWaitingForEmailVerification === true) {
                this.emailValidationState = 'WAITING';
              } else {
                this.$router.push('/completed-connection');
              }
            },
            (e) => {
              loadingComponent.close();
              this.emailErrorMessage = "Could't send verification email";
            }
          )
        });
    } else {
      this.emailErrorMessage = 'Please enter a valid email adress';
    }
  }

  public validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public onResendEmail() {
    this.onStartEmailVerification();
  }

  public onContinueEmail() {
    const loadingComponent = this.$buefy.loading.open({});
    this.emailErrorMessage = '';

    this.auth.getAccessToken().then(
      (accessToken: any) => {
        this.openPlatforms.checkIfEmailIsAlreadyValidated(
          accessToken,
          this.email
        ).then(
          () => {
            this.$router.push('/completed-connection');
            loadingComponent.close();
          },
          (e) => {
            this.emailErrorMessage = 'Email not yet verified, if you cannot find the email wait a couple of minutes and check that is has not reached your spam folder.';
            loadingComponent.close();
          }
        )
      });
  }

  public onContinueOath() {
    const loadingComponent = this.$buefy.loading.open({});
    const baseUrl = window.location.protocol + '//' + window.location.host;
    this.auth.getAccessToken().then(
      (accessToken: any) => {
        this.openPlatforms.startOauthConnection(
          accessToken,
          this.appState.platform.platformId,
          this.appState.app.appId,
          baseUrl + '/completed-connection'
        );
      },
      () => {
        loadingComponent.close();
        this.$buefy.modal.open({
          parent: this,
          component: LoginNeededModal,
          hasModalCard: true
        });
      }
    );
  }

  public onCancel() {
    this.openPlatforms.cancelConnectionFlow(this.appState);
  }
}
</script>