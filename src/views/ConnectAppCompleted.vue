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
        <h2>You have now created a live connection that sends the following data from {{appState.platform.name}} to {{appState.app.name}} </h2>
        <ul>
            <li>Number of gigs you have completed</li>
            <li>Average rating you have received from clients</li>
        </ul>
            <p><b>Please note:</b>This is a live connection. Your data will be updated whenever you complete more gigs on Freelancer.
              If you later want to revoke this connection, login to <a href="https://user.openplatforms.org">user.openplatforms.org</a></p>
        </div>
        <button class="button is-primary is-large" @click="onFinish()">Finish</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
li {
  list-style: disc;
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

@Component({
  components: {    ConnectionDiagram

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
    }
  }

  public onFinish() {
    console.log(this.appState);
    window.location.href = this.appState.returnurl;
  }

  public onCancel() {
    // TODO: ask if it should remove connection leave open platforms either by going back to returnUrl
  }
}
</script>