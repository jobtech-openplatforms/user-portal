<template>
  <div class="connection-display panel">
    <div class="image-container">
      <img v-if="connection.logo" v-bind:src="connection.logo" />
    </div>
    <div class="connection-content-container">
      <h3>{{ connection.name }}</h3>
      <p>{{ connection.description }}</p>
    </div>
    <div class="connection-active-container">
      <p v-if="connection.isActive">Active</p>
      <p v-if="!connection.isActive">Inactive</p>
      <SliderCheckbox
        :value="connection.isActive"
        v-on:change="onChangeActive($event.target.checked)"
      />
    </div>
    <div class="connection-menu-container">
      <button class="remove-button icon-button" @click="onRemove()">
        <i class="far fa-times"></i>
      </button>
    </div>
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
.image-container img {
  width: 100%;
  height: 100%;
}
.connection-content-container {
  width: 100%;
  margin-right: 20px;
}
.connection-active-container {
  margin-right: 20px;
}
</style>

<script lang="ts">
import SliderCheckbox from "./SliderCheckbox.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ConnectionData } from "../datatypes/ConnectionData";
import { Actions } from "../Actions";
import { Action } from "vuex";

@Component({
  components: {
    SliderCheckbox
  }
})
export default class ConnectionDisplay extends Vue {
  @Prop()
  public connection!: ConnectionData;

  private dispatch: (a: Actions.ActionBase) => void;

  constructor() {
    super();
    this.dispatch = this.$store.dispatch;
  }

  public onChangeActive(value: boolean) {
    this.dispatch(new Actions.SetPlatformActivity(this.connection.id, value));
  }

  public onRemove() {
    this.dispatch(new Actions.RemovePlatform(this.connection.id));
  }
}
</script>

