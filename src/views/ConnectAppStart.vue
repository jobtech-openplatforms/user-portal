<template>
  <div class="connect-app-start-page page-content">
    <div v-if="!isDataFetched">
      <p>Loading...</p>
    </div>
    <div v-if="isDataError">
      <p>Something went wrong, error message:</p>
      <p>{{errorMessage}}</p>
    </div>
    <div v-if="isDataFetched">
      <div class="centered-content">
        <ConnectionDiagram :state="appState" />
        <h2>Access data from {{appState.platform.name}}</h2>
        <p>
          Open Platforms to let's you access your reputation data from connected gig platforms.
          <a
            href="https://openplatforms.org"
          >Read more</a>
        </p>
        <h4>{{appState.app.name}} want to access the following data from {{appState.platform.name}}:</h4>
        <ul>
          <li>The number of gigs you have completed</li>
          <li>The average rating you have received from clients</li>
        </ul>
        <p>Login or create an account to add this connections!</p>
        <button class="button is-primary is-large" @click="onLogin()">Sign in to Open Platforms</button>
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

@Component({
  components: {    ConnectionDiagram

  }
})
export default class ConnectAppStart extends Vue {
  public isDataFetched = false;
  public isDataError = false;
  public errorMessage = '';
  private state: TypedState = <TypedState>(<any>this.$store.state);

  public appState!: ConnectAppState;

  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  private mounted() {
    localStorage.removeItem('loginState');
    // test url: http://localhost:8080/initiate-connection?app=7NEAJI5VsdIVQzyoNt3Qp5ESk6DvxEqd&platform=5846584a-2719-48dd-bef2-83c6d7dbd421&state=user123&permissions=1&returnurl=%27http%3A%2F%2Flocalhost%3A8080%2Freturned

    if (
      this.$route.query.app
      && this.$route.query.platform
      && this.$route.query.state
      && this.$route.query.returnurl
      && this.$route.query.permissions
    ) {
      const platformsPromise = axios.get(process.env.VUE_APP_CV_DATA_API_PATH + 'Platform/available', {
        headers: {
          Accept: 'application/json',
          Authorization: ``
        }
      });
      const appPromise = axios.get(process.env.VUE_APP_CV_DATA_API_PATH + 'App/' + this.$route.query.app as string, {
        headers: {
          Accept: 'application/json',
          Authorization: ``
        }
      });
      Promise.all([platformsPromise, appPromise]).then((r) => {
        const platforms = r[0].data as APIPlatformData[];
        const apiPlatformData = platforms.find((p) => p.platformId === this.$route.query.platform) as APIPlatformData;
        const platform = PlatformData.fromAPIData(apiPlatformData);

        // TODO: use proper API
        console.log(r[1].data);
        const apiAppData = r[1].data as APIApplicationsData;
        const app = ApplicationData.fromAPIData(apiAppData, platforms);
        // const app = { appId: '123', name: "TestApp", description: "This a really cool app", url: "https://dn.se", connectedPlatforms: [], logoUrl: "https://app.mydigitalbackpack.org/assets/gfx/platform-icons/upwork.png" }

        this.appState = {
          type: 'CONNECT',
          route: 'connect-app',
          app,
          platform,
          state: this.$route.query.state as string,
          returnurl: this.$route.query.returnurl as string,
          permissions: parseInt(this.$route.query.permissions as string, 10)
        }
        this.isDataFetched = true;
      });
    } else {
      this.errorMessage = 'Your link doesn not include all necessary parameters, please check that you got the complete url.';
    }
  }

  public onLogin() {
    localStorage.setItem('loginState', JSON.stringify(this.appState));
    this.dispatch(new Actions.Login(this.$auth));
  }
}
</script>