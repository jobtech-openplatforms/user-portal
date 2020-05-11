<template>
  <div class="permissions-description">
    <ul id="access-data-list" class="panel" v-if="permissions===1">
      <li>The number of gigs you have completed</li>
      <li>The average rating you have received from clients</li>
    </ul>
    <ul v-if="permissions===2">
      <li>The number of gigs you have completed</li>
      <li>The average rating you have received from clients</li>
      <li>Reviews and achievements</li>
      <li>Detailed information about your gigs, such as time, location and income. The data depends on the platform.</li>
    </ul>
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class PermissionsDecriptions extends Vue {
  @Prop()
  public permissions!: number;
}
</script>

