<template>
  <div v-if="content">
    <p
      v-html="renderToHtml(content[0].content)"
      @click="handleClicks"
      class="dynamic-content"
    ></p>
  </div>
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
