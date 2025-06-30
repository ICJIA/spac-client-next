<template>
  <div>
    <v-card
      class="mx-auto py-0 mb-8"
      style="border-bottom: 1px solid #ddd"
      :class="{
        'elevation-3': elevation,
        'elevation-0': !elevation
      }"
    >
      <v-row>
        <v-col cols="12" v-if="displayNewsLink">
          <div class="text-right spac-purple mr-10">
            <div
              class="heavy category hover"
              style="color: #fff !important; text-decoration: none !important; font-weight: 900 !important"
              @click="
                $router.push('/news').catch(err => {
                  $vuetify.goTo(0);
                })
              "
            >
              SPAC Announcements
            </div>
          </div>
        </v-col>
      </v-row>
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
              content.title
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
          :eventLabel="content.title"
          v-if="readMore"
        ></readmore>
        <div
          v-else
          @click="handleClicks"
          class="dynamic-content lato"
          v-html="renderToHtml(content.content)"
        ></div>
        <TagList :tags="content.tags" class="mt-10" v-if="!readMore"></TagList>
        <v-container class="mt-4">
          <v-row>
            <!-- <v-col cols="12" sm="12" md="6">
              <div class="text-left" v-if="content.createdAt">
                Posted: {{ content.createdAt | timeAgoFormat }}
              </div>
            </v-col> -->
            <v-col cols="12" sm="12" md="12">
              <div
                class="text-right"
                v-if="
                  content.updatedAt &&
                    displayUpdated(content.createdAt, content.updatedAt)
                "
              >
                Last updated: {{ content.updatedAt | timeAgoFormat }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
/**
 * @fileoverview News card component for displaying news articles and announcements.
 * Renders a card with title, content, posted date, and read more functionality.
 * Supports various display options including elevation, height control, and news link display.
 */

import Readmore from "@/components/Readmore";
import PostedDate from "@/components/PostedDate";
import { renderToHtml } from "@/services/Markdown";
import { handleClicks } from "@/mixins/handleClicks";
import TagList from "@/components/TagList";
import moment from "moment";

/**
 * News card component for displaying news articles.
 * Shows title, content preview, posted/updated dates, and tags.
 * Includes read more functionality and responsive design options.
 *
 * @vue
 * @displayName NewsCard
 */
export default {
  components: {
    PostedDate,
    Readmore,
    TagList
  },
  /**
   * Component data function.
   * Provides access to service functions for template usage.
   *
   * @returns {Object} Component reactive data
   * @returns {Function} returns.renderToHtml - Markdown rendering function
   */
  data() {
    return {
      renderToHtml
    };
  },

  mixins: [handleClicks],

  methods: {
    /**
     * Determines if the updated date should be displayed.
     * Shows updated date only if it's more than 1 day after creation.
     *
     * @param {string} createdAt - ISO date string of creation
     * @param {string} updatedAt - ISO date string of last update
     * @returns {boolean} True if updated date should be shown
     */
    displayUpdated(createdAt, updatedAt) {
      const posted = moment(createdAt);
      const updated = moment(updatedAt);
      const duration = moment.duration(updated.diff(posted)).days();

      if (duration > 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  /**
   * Component props definition.
   *
   * @typedef {Object} Props
   * @property {boolean} readMore - Whether to show read more functionality
   * @property {number} height - Maximum height for content preview in pixels
   * @property {Object} content - News article content object
   * @property {string} content.title - Article title
   * @property {string} content.content - Article content in markdown
   * @property {string} content.slug - Article URL slug
   * @property {string} content.createdAt - Creation date
   * @property {string} content.updatedAt - Last update date
   * @property {Array} content.tags - Associated tags
   * @property {boolean} elevation - Whether to show card elevation/shadow
   * @property {boolean} fullHeight - Whether to display full content height
   * @property {boolean} displayNewsLink - Whether to show "SPAC Announcements" link
   */
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
    },
    displayNewsLink: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
.cardBackground {
  background: #fff !important;
}
</style>
