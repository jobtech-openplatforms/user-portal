<template>
  <div class="application-display panel">
    <div class="image-container">
      <img v-if="application.logo" v-bind:src="application.logo" />
    </div>
    <div class="application-content-container">
      <h3>{{ application.name }}</h3>
      <p>{{ application.description }}</p>

      <div class="connected-platforms-container">
        <h3 @click="onToggleConnectionList()">
          <button class="exapand-button icon-button">
            <i v-if="!isPlatformsExpanded" class="far fa-chevron-up"></i>
            <i v-if="isPlatformsExpanded" class="far fa-chevron-down"></i>
          </button>
          Sharing {{noOfActiveConnections}} of {{noOfConnections}} data sources
        </h3>
        <FadeTransition>
          <div v-if="isPlatformsExpanded" class="connection-list">
            <div
              class="platform-connection"
              v-for="platform in application.connectedPlatforms"
              v-bind:key="platform.id"
            >
              <div class="image-container">
                <img v-if="platform.logo" v-bind:src="platform.logo" />
              </div>
              <div class="connection-content-container">
                <h4>{{ platform.name }}</h4>
              </div>
              <div>
                <SliderCheckbox
                  v-model="platform.isActive"
                  v-on:change="onChangeActive(platformId, $event.target.checked)"
                />
              </div>
            </div>
          </div>
        </FadeTransition>
      </div>
    </div>
    <div class="application-menu-container">
      <button class="remove-button icon-button" @click="onRemove()">
        <i class="far fa-times"></i>
      </button>
    </div>
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
.image-container img {
  width: 100%;
  height: 100%;
}
.application-content-container,
.connection-content-container {
  width: 100%;
  margin-right: 20px;
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
</style>

<script lang="ts">
import FadeTransition from "./FadeTransition.vue";
import SliderCheckbox from "./SliderCheckbox.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ApplicationData } from "../datatypes/ApplicationData";

@Component({
  components: {
    SliderCheckbox,
    FadeTransition
  }
})
export default class ApplicationDisplay extends Vue {
  @Prop()
  public application!: ApplicationData;

  public isPlatformsExpanded = false;

  constructor() {
    super();
  }

  get noOfConnections() {
    return this.application.connectedPlatforms.length;
  }

  get noOfActiveConnections() {
    return this.application.connectedPlatforms.filter(p => p.isActive).length;
  }

  public onChangeActive(platformId: string, value: boolean) {
    console.log(platformId, "changed to:", value, value === true);
  }

  public onToggleConnectionList() {
    this.isPlatformsExpanded = !this.isPlatformsExpanded;
  }

  public onRemove() {
    console.log("Remove");
  }
}
</script>

