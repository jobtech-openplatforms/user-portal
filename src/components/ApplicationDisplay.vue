<template>
  <div class="application-display panel">
    <h3 class="overflow-elipsis">{{ application.name }}</h3>
      <div class="application-content-container">
        <div class="image-container">
          <img v-if="application.logoUrl" v-bind:src="application.logoUrl" />
        </div>
        <div class="app-info-container">
          <p>{{ application.description || "Missing application description"}}</p>
        </div>
      </div>

        <div class="connected-platforms-container" v-if="noOfConnections>0">
          <h4 @click="onToggleConnectionList()">
            <button class="expand-button icon-button">
              <i v-if="!isPlatformsExpanded" class="far fa-chevron-up"></i>
              <i v-if="isPlatformsExpanded" class="far fa-chevron-down"></i>
            </button>
            <span v-if="noOfConnections===1">Can access 1 data source</span>
            <span
              v-if="noOfConnections>1"
            >Can access {{noOfActiveConnections}} of {{noOfConnections}} data sources</span>
          </h4>
          <hr>
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
                <div class="application-active-container">
                  <b-switch
                    v-model="platform.isConnected"
                    v-on:change.native="onChangeActive(platform.platformId, $event.target.checked)"
                  />
                </div>
              </div>
            </div>
          </FadeTransition>
    </div>
    <!-- <div class="application-menu-container">
      <button class="remove-button icon-button" @click="onRemove()">
        <i class="far fa-times"></i>
      </button>
    </div>-->
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/css/_variables";

.image-container {
  @extend %icon-image;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
}
.application-content-container {
  display:flex;
  flex-direcion:row;
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
  margin-top:20px;

  h4{
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
    align-items:center;

    span{
      color:$color-brand;
      font-weight:bold;
      font-size:15px;
    }

    .expand-button{
      @extend %icons-margin;
    }
  }
}

.connection-content-container{
      flex-grow:1;
}

.platform-connection {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  align-items: center;
  .image-container{
    flex-basis:35px;
    height:35px;
  }

}



%icon-image{
  @extend %icons-margin;
  flex:0 0 65px;
  height:65px;
  margin-right:20px;
  @media (max-width: 600px) {
    flex-basis:35px;
    height:35px;
    margin-right:10px;
  }
}

%icons-margin{
   margin-right:20px;
  @media (max-width: 600px) {
    margin-right:10px;
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

