<template>
  <v-container fluid class="px-5 pt-8" style="background: #fff">
    <v-row>
      <v-col>
        <div v-if="content">
          <p
            v-html="renderToHtml(content[0].content)"
            @click="handleClicks"
            class="dynamic-content"
          ></p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { handleClicks } from "@/mixins/handleClicks";
import { renderToHtml } from "@/services/Markdown";
export default {
  mixins: [handleClicks],
  props: {
    content: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      renderToHtml
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
