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
        <ConnectionDiagram :state="appState" />

        <div v-if="appState.platform.authMechanism ==='Email'">
          <div v-if="emailValidationState=='START'">
            <h2>Step 1: Connect {{appState.platform.name}}</h2>
            <p>Enter the email adress you use on {{appState.platform.name}}</p>
            <div>
              <input type="email" v-model="email" required />
              <p v-if="emailErrorMessage" class="error-message">{{emailErrorMessage}}</p>
            </div>
            <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
            <button
              class="button is-primary is-large"
              @click="onStartEmailVerification()"
            >Validate email</button>
          </div>
          <div v-if="emailValidationState=='WAITING'">
            <h2>Step 2: Click on the email link</h2>
            <p>
              To verify your email adress, we have sent a mail to
              <b>{{email}}</b> with a verification link.
              Click on the link in the email and then continue.
            </p>
            <p v-if="emailErrorMessage" class="error-message">
              {{emailErrorMessage}}
              <br />
              <a class="resend-email-link" @click="onResendEmail()">Resend verification email</a>
            </p>
            <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
            <button class="button is-primary is-large" @click="onContinueEmail()">Email is validated</button>
          </div>
        </div>

        <div v-if="appState.platform.authMechanism ==='Oauth2'">
          <h2>Connect {{appState.platform.name}}</h2>
          <p>You will now be redirected to {{appState.platform.name}} where you need to allow that Open Platforms can access your data</p>
          <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
          <button class="button is-primary is-large" @click="onContinueOath()">Continue</button>
        </div>
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
    const loadingComponent = this.$buefy.loading.open({});
    this.appState = JSON.parse(localStorage.getItem('loginState') as string);
    if (this.appState) {
      this.isDataFetched = true;
    } else {
      this.isDataError = true;
      this.errorMessage = 'Could not find connection data, please try again.';
    }
    this.auth.getAccessToken().then((token) => {
      this.openPlatforms.connectUser(token, this.appState).then(() => {
        loadingComponent.close();
      }).catch(() => {
        loadingComponent.close();
        this.isDataError = true;
        this.errorMessage = 'Could not register Open Platform user to ' + this.appState.app.name;
      });
    }).catch(() => {
      loadingComponent.close();
      this.isDataError = true;
      this.errorMessage = 'Could not find valid auth token.';
    });


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
            this.email,
            this.appState.permissions
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
          baseUrl + '/completed-connection',
          this.appState.permissions
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