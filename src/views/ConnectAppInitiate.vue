<template>
  <div class="connect-app-start-page page-content">
    <div v-if="!isDataFetched && !isDataError">
      <p>Loading...</p>
    </div>
    <div v-if="isDataError">
      <p>{{errorMessage}}</p>
      <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
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
        <PermissionsDescription :permissions="appState.permissions" />
        <p>Login or create an account to add this connections!</p>
        <button class="button is-secondary is-large" @click="onCancel()">Cancel</button>
        <button class="button is-primary is-large" @click="onLogin()">Sign in to Open Platforms</button>
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

@Component({
  components: { ConnectionDiagram, PermissionsDescription }
})
export default class ConnectAppInitiate extends Vue {
  public isDataFetched = false;
  public isDataError = false;
  public errorMessage = '';
  private state: TypedState = <TypedState>(<any>this.$store.state);
  private openPlatforms: OpenPlatformsService = (<any>this).$openPlatforms;

  public appState!: ConnectAppState;

  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  private mounted() {
    localStorage.removeItem('loginState');
    // test url: http://localhost:8080/initiate-connection?app=I3QqMnonxGKS9FlBw7FfZhenDhk7Y4Te&platform=5846584a-2719-48dd-bef2-83c6d7dbd421&permissions=1&requestid=test123456">

    if (
      this.$route.query.app
      && this.$route.query.platform
      && this.$route.query.permissions
      && this.$route.query.requestid
      && (this.$route.query.returnurl || window.opener !== null)
    ) {
      const loadingComponent = this.$buefy.loading.open({});
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
        loadingComponent.close();
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
          requestId: this.$route.query.requestid as string,
          callbackurl: app.callbackUrl,
          returnurl: this.$route.query.returnurl as string,
          permissions: parseInt(this.$route.query.permissions as string, 10)
        }
        this.isDataFetched = true;
      },
        () => {
          loadingComponent.close();
          this.isDataError = true;
          this.errorMessage = 'Could not access data from the application/platform from Open Platforms. Please reload the page or check that the url is correct.';
        });
    } else {
      this.isDataError = true;
      this.errorMessage = "Your link doesn't not include all necessary parameters, please check that you got the complete url from the application you want to access your data.";
    }
  }

  public onLogin() {
    const loadingComponent = this.$buefy.loading.open({});
    localStorage.setItem('loginState', JSON.stringify(this.appState));
    this.dispatch(new Actions.Login(this.$auth));
  }

  public onCancel() {
    this.openPlatforms.cancelConnectionFlow(this.appState);
  }
}
</script>