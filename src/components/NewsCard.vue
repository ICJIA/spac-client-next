<template>
  <div>
    <v-card
      class="mx-auto py-5 mb-8"
      :class="{
        'elevation-5': elevation,
        'elevation-0': !elevation,
        cardBackground: elevation
      }"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <PostedDate
            :createdAt="content.createdAt"
            :updatedAt="content.updatedAt"
            class=""
            style="margin-left: -15px;"
          ></PostedDate>
          <v-list-item-title
            class="headline mb-1"
            style="font-weight: 700; font-size: 28px !important; margin: 0; padding: 0;"
            ><router-link :to="`/news/${content.slug}`" class="news-link">{{
              content.title | titleCase
            }}</router-link></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-card-text style="font-size: 14px">
        <readmore
          :content="renderToHtml(content.content)"
          :tags="content.tags"
          :height="height"
          readMoreText="Read More"
          :hideReadLess="true"
          class="markdown-body"
          :fullHeight="fullHeight"
          v-if="readMore"
        ></readmore>
        <div
          v-else
          @click="handleClicks"
          class="dynamic-content"
          v-html="renderToHtml(content.content)"
        ></div>
        <TagList :tags="content.tags" class="mt-10" v-if="!readMore"></TagList>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Readmore from "@/components/Readmore";
import PostedDate from "@/components/PostedDate";
import { renderToHtml } from "@/services/Markdown";
import { handleClicks } from "@/mixins/handleClicks";
import TagList from "@/components/TagList";
export default {
  components: {
    PostedDate,
    Readmore,
    TagList
  },
  data() {
    return {
      renderToHtml
    };
  },
  mixins: [handleClicks],
  methods: {},
  props: {
    readMore: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 150
    },
    content: {
      type: Object,
      default: () => {}
    },
    elevation: {
      type: Boolean,
      default: false
    },
    fullHeight: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
.cardBackground {
  background: #f5f5f5 !important;
}
</style>
