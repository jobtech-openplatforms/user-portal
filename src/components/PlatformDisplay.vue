<template>
  <div class="platform-display panel">
    <div class="flex-row">
      <h3 class="overflow-elipsis">{{ platform.name }}</h3>
      <div class="platform-active-container">
        <b-switch
          v-model="platform.isConnected"
          v-on:change.native="onChangeActive($event.target.checked)"
        />
        <!--p v-if="platform.isConnected">Active</p>
        <p v-if="!platform.isConnected">Inactive</p-->
      </div>
    </div>
      <!-- <div class="platform-menu-container">
        <button class="remove-button icon-button" @click="onRemove()">
          <i class="far fa-times"></i>
        </button>
      </div>-->
    <div class="flex-row">
      <div class="image-container">
        <img v-if="platform.logoUrl" v-bind:src="platform.logoUrl" />
      </div>
      <div class="platform-content-container">
        <p>{{ platform.description }}</p>
      </div>
    </div>
  </div>
    
</template>

<style lang="scss" scoped>
.platform-display {


  &>*{
    display:flex;
    flex-direction:row;
  }
}
.image-container {
  flex:0 0 65px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin-right:20px;
}

.image-container img {
  width: 100%;
  height: 100%;
}
.platform-content-container {
  width: 100%;
  overflow: hidden;
}

.platform-active-container{
  transform-origin:top right;
  p {
    margin: 0;
    text-align: center;
  }
}

</style>

<script lang="ts">
import SliderCheckbox from "./SliderCheckbox.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { PlatformData } from "../datatypes/PlatformData";
import { Actions } from "../store/Actions";
import { Action } from "vuex";
import { ActionBase } from "../store/ActionBase";

@Component({
  components: {}
})
export default class PlatformDisplay extends Vue {
  @Prop()
  public platform!: PlatformData;

  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  constructor() {
    super();
  }

  public onChangeActive(value: boolean) {
    this.dispatch(new Actions.SetPlatformActive(this.platform.platformId, value));
  }

  // public onRemove() {
  //   this.dispatch(new Actions.RemovePlatform(this.platform.id));
  // }
}
</script>

