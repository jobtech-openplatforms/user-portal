<template>
  <div class="platform-display panel">
    <div class="image-container">
      <img v-if="platform.logo" v-bind:src="platform.logo" />
    </div>
    <div class="platform-content-container">
      <h3 class="overflow-elipsis">{{ platform.name }}</h3>
      <p>{{ platform.description }}</p>
    </div>
    <div class="platform-active-container">
      <b-switch
        class="is-large"
        v-model="platform.isActive"
        v-on:change.native="onChangeActive($event.target.checked)"
      />
      <p v-if="platform.isActive">Active</p>
      <p v-if="!platform.isActive">Inactive</p>
    </div>
    <!-- <div class="platform-menu-container">
      <button class="remove-button icon-button" @click="onRemove()">
        <i class="far fa-times"></i>
      </button>
    </div>-->
  </div>
</template>

<style scoped>
.platform-display {
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
.platform-content-container {
  width: 100%;
  margin-right: 20px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .platform-content-container {
    margin-right: 10px;
  }
}

.platform-active-container p {
  margin: 0;
  text-align: center;
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

