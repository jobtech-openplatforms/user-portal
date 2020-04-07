<template>
  <div class="connect-app-start-page page-content">
    CONTINUE CONNECTING
    <div v-if="!isDataFetched">
      <p>Loading...</p>
    </div>
    <div v-if="isDataError">
      <p>Something went wrong, error message:</p>
      <p>{{errorMessage}}</p>
    </div>
    <div v-if="isDataFetched">
      <div class="centered-content">
        <div class="connection-diagram">
          <div class="platform-box">
            <img class="logo-icon" :src="appState.platform.logoUrl" />
            <p>{{appState.platform.name}}</p>
          </div>
          <div class="arrow">
            <i class="far fa-arrow-right"></i>
          </div>
          <div class="openplatforms-box">
            <img class="logo-icon" src="../assets/images/open-platforms-logo-icon.png" />
            <p>Open Platforms</p>
          </div>
          <div class="arrow">
            <i class="far fa-arrow-right"></i>
          </div>
          <div class="app-box">
            <img class="logo-icon" :src="appState.app.logoUrl" />
            <p>{{appState.app.name}}</p>
          </div>
        </div>
        <h2>Connect {{appState.platform.name}} to {{appState.app.name}}</h2>
        <p>
          {{appState.app.name}} uses Open Platforms to let you access your reputation data from connected gig platforms.
          <a
            href="https://openplatforms.org"
          >Read more</a>
        </p>
        <p>Login or create an account to add this connections!</p>
        <button class="button is-primary is-large" @click="onLogin()">Login to Open Platforms</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connection-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
}
.platform-box,
.openplatforms-box,
.app-box {
  background: white;
  padding: 15px;
  border-radius: 15px;
  min-width: 120px;
  text-align: center;
  margin-right: 15px;
}
.arrow {
  margin-right: 15px;
}
.logo-icon {
  width: 72px;
  height: 72px;
}
</style>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TypedState } from "../datatypes/TypedState";
import { ConnectAppState } from "../datatypes/ConnectAppState";
import { ActionBase } from "../store/ActionBase";
import { Actions } from "../store/Actions";
import axios from 'axios';
import { APIPlatformData, APIApplicationsData } from '../datatypes/APIdata';
import { PlatformData } from '../datatypes/PlatformData';
import { ApplicationData } from '../datatypes/ApplicationData';

@Component({
  components: {

  }
})
export default class ConnectApp extends Vue {
  public isDataFetched = false;
  public isDataError = false;
  public errorMessage = '';
  private state: TypedState = <TypedState>(<any>this.$store.state);

  public appState!: ConnectAppState;

  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  private mounted() {
    console.log();
    // localStorage.removeItem('loginState');
    // test url: http://localhost:8080/connect-start?app=7NEAJI5VsdIVQzyoNt3Qp5ESk6DvxEqd&platform=5846584a-2719-48dd-bef2-83c6d7dbd421&state=user123&permissions=1&returnurl=%27http%3A%2F%2Flocalhost%3A8080%2Freturned


  }

  public onLogin() {
    localStorage.setItem('loginState', JSON.stringify(this.appState));
    this.dispatch(new Actions.Login(this.$auth));
  }
}
</script>