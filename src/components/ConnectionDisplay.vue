<template>
  <div class="connection-display panel">
    <div class="image-container">
      <img v-if="connection.logo" v-bind:src="connection.logo" />
    </div>
    <div class="connection-content-container">
      <h3 class="overflow-elipsis">{{ connection.name }}</h3>
      <p>{{ connection.description }}</p>
    </div>
    <div class="connection-active-container">
      <b-switch
        class="is-large"
        v-model="connection.isActive"
        v-on:change.native="onChangeActive($event.target.checked)"
      />
      <p v-if="connection.isActive">Active</p>
      <p v-if="!connection.isActive">Inactive</p>
    </div>
    <!-- <div class="connection-menu-container">
      <button class="remove-button icon-button" @click="onRemove()">
        <i class="far fa-times"></i>
      </button>
    </div>-->
  </div>
</template>

<style scoped>
.connection-display {
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
.connection-content-container {
  width: 100%;
  margin-right: 20px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .connection-content-container {
    margin-right: 10px;
  }
}

.connection-active-container p {
  margin: 0;
  text-align: center;
}
</style>

<script lang="ts">
import SliderCheckbox from "./SliderCheckbox.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ConnectionData } from "../datatypes/ConnectionData";
import { Actions } from "../store/Actions";
import { Action } from "vuex";
import { ActionBase } from "../store/ActionBase";

@Component({
  components: {}
})
export default class ConnectionDisplay extends Vue {
  @Prop()
  public connection!: ConnectionData;

  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  constructor() {
    super();
  }

  public onChangeActive(value: boolean) {
    this.dispatch(new Actions.SetPlatformActive(this.connection.id, value));
  }

  // public onRemove() {
  //   this.dispatch(new Actions.RemovePlatform(this.connection.id));
  // }
}
</script>

