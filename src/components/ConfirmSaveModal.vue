<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Confirm save</p>
    </header>
    <section class="modal-card-body">
      <p v-if="noPlatformsRemoved > 0">
        You have deactived one or more platforms.
        This means that these platforms will be removed from your account and any saved data from
        that platform will also be removed. Applications will not be able to access new data from these platforms.
      </p>
      <p v-if="noApplicationsRemoved > 0">
        You have deactived all connections to one or more applications.
        These applications will be removed from your account and will not be able to access new data.
      </p>

      <div v-if="noApplicationsRemoved === 0 && noPlatformsRemoved=== 0">
        <p v-if="noInactiveAppPlatformConnections>0">
          You have deactived one or more connections from a platforms to an apps.
          These apps will no longer be able to access your data.
        </p>
        <p
          v-if="noInactiveAppPlatformConnections===0"
        >All apps are now set to access data from all connected platforms.</p>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="left"></div>
      <div class="right">
        <button class="button" v-on:click="onCancel()">Cancel</button>
        <button class="button is-primary" v-on:click="onConfirm()">Save settings</button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TypedState } from "../datatypes/TypedState";
import { ActionBase } from "../store/ActionBase";
import { Actions } from "../store/Actions";

@Component({})
export default class ConfirmSaveModal extends Vue {
  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;
  private state: TypedState = <TypedState>(<any>this.$store.state);

  @Prop()
  private data: any;

  private isSaveInProgress = false;
  private noPlatformsRemoved = 0;
  private noApplicationsRemoved = 0;
  private noInactiveAppPlatformConnections = 0;

  mounted() {
    this.noPlatformsRemoved = this.state.connectedPlatforms.filter(p => {
      return p.isConnected === false;
    }).length;

    this.noApplicationsRemoved = this.state.connectedApplications.filter(a => {
      return a.connectedPlatforms.filter(p => p.isConnected === true).length === 0;
    }).length;

    this.noInactiveAppPlatformConnections = 0;
    this.state.connectedApplications.forEach(a => {
      return a.connectedPlatforms.forEach(p => {
        if (p.isConnected === false) {
          this.noInactiveAppPlatformConnections++;
        }
      });
    });
  }

  onCancel() {
    this.$emit("cancel", this.data);
    this.$emit("close", this.data);
  }
  onConfirm() {
    if (this.isSaveInProgress) {
      return;
    }
    this.isSaveInProgress = true;
    const loadingComponent = this.$buefy.loading.open({ isFullPage: true, canCancel: false });

    this.dispatch(new Actions.SaveState(this.state, this.$auth)).then(
      () => {
        this.$buefy.toast.open({
          message: `Your settings are saved, updating data`
        });
        this.dispatch(new Actions.LoadInitialState(this.$auth)).then(() => {
          this.$emit("close", this.data);
          setTimeout(() => {
            loadingComponent.close();
          }, 1500);
        });
      },
      () => {
        loadingComponent.close();

        this.$buefy.toast.open({
          duration: 7000,
          message: `Couldn't save your setting, make sure you are online and try again or contact support`,
          type: "is-danger"
        });
        this.isSaveInProgress = false;
      }
    );
  }
}
</script>
