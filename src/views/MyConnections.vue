<template>
  <div class="connections-page page-content">
    <h2>You have connected the following data sources</h2>
    <ConnectionDisplay
      v-for="connection in connections"
      v-bind:key="connection.id"
      v-bind:connection="connection"
    />

    <h2>The following apps can access your data</h2>
    <ApplicationDisplay
      v-for="application in applications"
      v-bind:key="application.id"
      v-bind:application="application"
    />
  </div>
</template>

<style scoped>
</style>


<script lang="ts">
import ApplicationDisplay from "../components/ApplicationDisplay.vue";
import ConnectionDisplay from "../components/ConnectionDisplay.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ConnectionData } from "../datatypes/ConnectionData";
import { ApplicationData } from "../datatypes/ApplicationData";
import { ApplicationConnectionData } from "../datatypes/ApplicationConnectionData";
import { TypedState } from "../TypedState";
import { Actions } from "../Actions";
import { Mutations } from "../Mutations";

@Component({
  components: {
    ConnectionDisplay,
    ApplicationDisplay
  }
})
export default class MyConnections extends Vue {
  private dispatch: Function = () => {};
  private state: TypedState = new TypedState();
  get connections(): ConnectionData[] {
    return this.state.connectedPlatforms;
  }
  get applications(): ApplicationData[] {
    return this.state.connectedApplications;
  }

  private mounted() {
    this.dispatch = <any>this.$store.dispatch;
    this.state = <TypedState>(<any>this.$store.state);
    this.dispatch(new Actions.LoadInitialState()).then(() => {
      console.log("set intitial state: ", this.state);
    });
  }
}
</script>