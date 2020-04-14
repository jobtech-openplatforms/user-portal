<template>
  <div class="application-display panel">
    <div class="image-container">
      <img v-if="application.logoUrl" v-bind:src="application.logoUrl" />
    </div>
    <div class="application-content-container">
      <div class="app-info-container">
        <h3 class="overflow-elipsis">{{ application.name }}</h3>
        <p>{{ application.description }}</p>
      </div>

      <div class="connected-platforms-container" v-if="noOfConnections>0">
        <h4 @click="onToggleConnectionList()">
          <button class="exapand-button icon-button">
            <i v-if="!isPlatformsExpanded" class="far fa-chevron-up"></i>
            <i v-if="isPlatformsExpanded" class="far fa-chevron-down"></i>
          </button>
          <span v-if="noOfConnections===1">Can access 1 data source</span>
          <span
            v-if="noOfConnections>1"
          >Can access {{noOfActiveConnections}} of {{noOfConnections}} data sources</span>
        </h4>
        <FadeTransition>
          <div v-if="isPlatformsExpanded" class="connection-list">
            <div
              class="platform-connection"
              v-for="platform in application.connectedPlatforms"
              v-bind:key="platform.platformId"
            >
              <div class="image-container">
                <img v-if="platform.logoUrl" v-bind:src="platform.logoUrl" />
              </div>
              <div class="connection-content-container">
                <h4 class="overflow-elipsis">{{ platform.name }}</h4>
              </div>
              <div>
                <b-switch
                  class="is-large"
                  v-model="platform.isConnected"
                  v-on:change.native="onChangeActive(platform.platformId, $event.target.checked)"
                />
              </div>
            </div>
          </div>
        </FadeTransition>
      </div>
    </div>
    <!-- <div class="application-menu-container">
      <button class="remove-button icon-button" @click="onRemove()">
        <i class="far fa-times"></i>
      </button>
    </div>-->
  </div>
</template>

<style scoped>
.application-display {
  display: flex;
  flex-direction: row;
}
.image-container {
  width: 116px;
  height: 116px;
  min-width: 116px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin-right: 20px;
  overflow: hidden;
}
@media (max-width: 600px) {
  .image-container {
    width: 50px;
    height: 50px;
    min-width: 50px;
    margin-right: 10px;
  }
}

.image-container img {
  width: 100%;
  height: 100%;
}
.application-content-container,
.connection-content-container {
  width: 100%;
  overflow: hidden;
}
.application-active-container {
  margin-right: 20px;
}
.menu-button {
  background: none;
  border: none;
}
.menu-button svg {
  height: 20px;
}

.connected-platforms-container {
  background: #f1f1f1;
  border-radius: 6px;
  padding: 10px;
}

.platform-connection {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  align-items: center;
}

.platform-connection .image-container {
  width: 60px;
  height: 60px;
  min-width: 60px;
}
@media (max-width: 600px) {
  .platform-connection .image-container {
    width: 30px;
    height: 30px;
    min-width: 30px;
  }
}
</style>

<script lang="ts">
import FadeTransition from "./FadeTransition.vue";
import SliderCheckbox from "./SliderCheckbox.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ApplicationData } from "../datatypes/ApplicationData";
import { ActionBase } from "../store/ActionBase";
import { Actions } from "../store/Actions";

@Component({
  components: {
    FadeTransition
  }
})
export default class ApplicationDisplay extends Vue {
  @Prop()
  public application!: ApplicationData;

  public isPlatformsExpanded = true;

  private dispatch: (a: ActionBase) => void;

  constructor() {
    super();
    this.dispatch = this.$store.dispatch;
  }

  get noOfConnections() {
    return this.application.connectedPlatforms.length;
  }

  get noOfActiveConnections() {
    return this.application.connectedPlatforms.filter(p => p.isConnected).length;
  }

  public onChangeActive(platformId: string, value: boolean) {
    this.dispatch(
      new Actions.SetApplicationConnectionActive(
        this.application.appId,
        platformId,
        value
      )
    );
  }

  public onToggleConnectionList() {
    this.isPlatformsExpanded = !this.isPlatformsExpanded;
  }

  public onRemove() {
    console.log("Remove");
  }
}
</script>

