<template>
  <div class="connections-page page-content">
    <div v-if="!isDataFetched">
      <p>Loading your settings...</p>
    </div>
    <div v-if="isDataError">
      <p>Couldn't load your settings, please try again.</p>
    </div>
    <div v-if="isDataFetched">
      <h2>You have connected the following data sources</h2>
      <PlatformDisplay
        v-for="connection in connections"
        v-bind:key="connection.platformId"
        v-bind:platform="connection"
      />
      <p v-if="connections.length===0">You currently have no connected platforms.</p>
      <hr />
      <h2>The following apps can access your data</h2>
      <ApplicationDisplay
        v-for="application in applications"
        v-bind:key="application.appId"
        v-bind:application="application"
      />
      <p v-if="applications.length===0">You currently have no connected applications.</p>
    </div>
  </div>
</template>

<style scoped>
</style>


<script lang="ts">
import ApplicationDisplay from "../components/ApplicationDisplay.vue";
import PlatformDisplay from "../components/PlatformDisplay.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { PlatformData } from "../datatypes/PlatformData";
import { ApplicationData } from "../datatypes/ApplicationData";
import { ApplicationConnectionData } from "../datatypes/ApplicationConnectionData";
import { TypedState } from "../datatypes/TypedState";
import { ActionBase } from "../store/ActionBase";
import { Actions } from "../store/Actions";
import { Mutations } from "../store/Mutations";
import HelloWorldVue from "../components/HelloWorld.vue";

@Component({
  components: {
    PlatformDisplay,
    ApplicationDisplay
  }
})
export default class MyConnections extends Vue {
  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;
  private state: TypedState = <TypedState>(<any>this.$store.state);
  public isDataFetched = false;
  public isDataError = false;

  get connections() {
    console.log(this.state.connectedPlatforms);
    return this.state.connectedPlatforms;
  }
  get applications() {
    return this.state.connectedApplications;
  }
  get isChanged() {
    return this.state.isChanged;
  }

  private mounted() {
    // TODO: setup proper route guards
    setTimeout(() => {
      if (this.$auth.isAuthenticated()) {
        this.$store.dispatch(new Actions.LoginCompleted());
        this.fetchData();
      } else {
        this.$router.push("/");
      }
    }, 0);
  }

  public fetchData() {
    this.dispatch(new Actions.LoadInitialState(this.$auth)).then(
      () => {
        this.isDataError = false;
        this.isDataFetched = true;
        console.log(this.state);
      },
      () => {
        this.isDataError = true;
      }
    );
  }
}
</script>