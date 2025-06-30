<template>
  <div>
    <div
      class="px-4"
      v-if="!loading"
      :class="{ 'py-10': !$browserDetect.isIE, iePull: $browserDetect.isIE }"
    >
      <slot name="title"></slot>

      <slot name="printer"></slot>
      <slot name="content"></slot>
    </div>
    <div v-else>
      <v-container>
        <v-row>
          <v-col>
            <loader></loader>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
/**
 * @fileoverview Base content wrapper component for the SPAC application.
 * Provides a standardized layout container with loading states, browser-specific styling,
 * and slot-based content organization. Handles IE-specific layout adjustments.
 */

import Loader from "@/components/Loader";

/**
 * Base content wrapper component.
 * Provides a consistent layout structure with loading states and browser compatibility.
 * Uses slots for flexible content organization (title, printer, content).
 *
 * @vue
 * @displayName BaseContent
 */
export default {
  components: {
    Loader
  },

  /**
   * Vue mounted lifecycle hook.
   * Currently used for debugging browser detection.
   */
  mounted() {
    // console.log(this.$browserDetect.isIE);
  },

  /**
   * Component props definition.
   *
   * @typedef {Object} Props
   * @property {boolean} loading - Whether the content is in loading state
   */
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped>
.iePull {
  margin-top: -75px;
}
</style>
