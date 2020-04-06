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
      <h2>Allow {{appData.name}} to get data from {{platformData.name}}</h2>
    </div>
  </div>
</template>

<style scoped>
</style>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TypedState } from "../datatypes/TypedState";
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
export default class ConnectAppStart extends Vue {
  public isDataFetched = false;
  public isDataError = false;
  public errorMessage = '';
  private state: TypedState = <TypedState>(<any>this.$store.state);

  public appData?: ApplicationData;
  public platformData?: PlatformData;

  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  private mounted() {
    if (
      this.$route.query.app
      && this.$route.query.platform
      && this.$route.query.state
      && this.$route.query.callback
      && this.$route.query.permissions
    ) {
      const platformsPromise = axios.get(process.env.VUE_APP_CV_DATA_API_PATH + 'Platform/available', {
        headers: {
          Accept: 'application/json',
          Authorization: ``
        }
      })
      Promise.all([platformsPromise]).then((r) => {
        const platforms = r[0].data as APIPlatformData[];
        console.log(platforms);
        const apiPlatformData = platforms.find((p) => p.platformId === this.$route.query.platform);
        if (apiPlatformData) {
          this.platformData = PlatformData.fromAPIData(apiPlatformData);
        }

        // TODO: use proper API
        // const applications = r[1].data as APIApplicationsData[];
        // const apiAppData = applications.find((a) => a.appId === this.$route.query.app);
        // if (apiAppData) {
        //   this.appData = ApplicationData.fromAPIData(apiAppData, platforms);
        // }
        this.appData = { appId: '123', name: "TestApp", description: "This a really cool app", url: "https://dn.se", connectedPlatforms: [], logoUrl: "https://app.mydigitalbackpack.org/assets/gfx/platform-icons/upwork.png" }

        this.isDataFetched = true;
      });
    } else {
      this.errorMessage = 'Your link doesn not include all necessary parameters, please check that you got the complete url.';
    }
  }

  public onLogin() {
    this.dispatch(new Actions.Login(this.$auth));
  }
}
</script>