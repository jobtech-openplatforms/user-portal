<template>
  <div class="connect-app-start-page page-content narrow-content">
    <div v-if="!isDataFetched && !isDataError">
      <p>Loading...</p>
    </div>
    <div v-if="isDataError">
      <p class="error-message">{{errorMessage}}</p>
      <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
    </div>
    <div v-if="isDataFetched">
      <div class="centered-content">
        <h1>
          You have now created a
          <strong>live connection!</strong>
        </h1>
        <ConnectionDiagram :state="appState" />
        <h2>
          <strong>The following data</strong>
          from {{appState.platform.name}} is now sent to {{appState.app.name}}:
        </h2>
        <PermissionsDescription :permissions="appState.permissions" />
        <p>
          <b>Please note:</b> This is a live connection. Your data will be updated whenever you complete more gigs on Freelancer.
          If you later want to revoke this connection, login to
          <a href="https://user.openplatforms.org">user.openplatforms.org</a>
        </p>
        <button class="button is-primary is-large" @click="onFinish()">Finish</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


<script lang="ts">
import PermissionsDescription from '../components/PermissionsDescription.vue'
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
  components: {    ConnectionDiagram, PermissionsDescription

  }
})
export default class ConnectAppCompleted extends Vue {
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

  public onFinish() {
    const loadingComponent = this.$buefy.loading.open({});
    this.openPlatforms.completeConnectionFlow(this.appState);
  }

  public onCancel() {
    const loadingComponent = this.$buefy.loading.open({});
    this.openPlatforms.cancelConnectionFlow(this.appState);
  }
}
</script>