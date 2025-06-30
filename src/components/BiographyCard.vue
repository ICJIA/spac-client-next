<template>
  <div>
    <v-card
      class="mx-auto white mb-8 pb-8 elevation-1"
      outlined
      style="min-height: 150px"
    >
      <v-list-item three-line>
        <v-list-item-avatar
          tile
          size="85"
          color="grey"
          v-if="person.headshot && !$browserDetect.isIE"
          class="hidden-sm-and-down"
        >
          <v-img
            :src="getHeadshotLink(person.headshot)"
            lazy-src="/placeholder-member.png"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <div
            class="overline mb-4"
            style="font-size: 12px !important;"
            v-html="person.membership"
          ></div>

          <v-list-item-title class="headline mb-1"
            ><router-link
              :to="`/about/biographies/${person.slug}`"
              class="no-underline dark-link"
              >{{ person.prefix }} {{ person.firstName }}
              {{ person.middleName }} {{ person.lastName }}{{ person.suffix }}
            </router-link></v-list-item-title
          >

          <v-list-item-subtitle>
            <div :class="{ boldTitle: person.boldTitle }">
              {{ person.title }}
            </div>
          </v-list-item-subtitle>

          <div
            @click="handleClicks"
            class="dynamic-content mt-5"
            v-if="person.content"
            v-html="renderToHtml(person.content)"
          ></div>
          <TagList :tags="person.tags"></TagList>
          <div
            class="mt-5 text-right heavy"
            style="font-size: 12px"
            v-if="displayCategory"
          >
            <div v-if="person.category === 'council'">
              <v-btn small depressed to="/about/council-members"
                >COUNCIL MEMBERS <v-icon right>open_in_new</v-icon></v-btn
              >
            </div>
            <div v-else>
              <v-btn small depressed to="/about/staff"
                >STAFF <v-icon right>open_in_new</v-icon></v-btn
              >
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
/**
 * @fileoverview Biography card component for displaying individual person profiles.
 * Renders a card with headshot, name, title, membership information, and biography content.
 * Includes responsive design and browser-specific handling for IE compatibility.
 */

import { renderToHtml } from "@/services/Markdown";
import { getHeadshotLink } from "@/services/Image";
import { handleClicks } from "@/mixins/handleClicks";
import TagList from "@/components/TagList";

/**
 * Biography card component for displaying person profiles.
 * Shows headshot, name, title, membership, and biography content with tags.
 * Supports responsive layout and handles markdown content rendering.
 *
 * @vue
 * @displayName BiographyCard
 */
export default {
  mixins: [handleClicks],
  components: {
    TagList
  },
  /**
   * Component data function.
   * Provides access to service functions for template usage.
   *
   * @returns {Object} Component reactive data
   * @returns {Function} returns.renderToHtml - Markdown rendering function
   * @returns {Function} returns.getHeadshotLink - Headshot image URL generator
   */
  data() {
    return {
      renderToHtml,
      getHeadshotLink
    };
  },

  /**
   * Component props definition.
   *
   * @typedef {Object} Props
   * @property {Object} person - Person object containing biography data
   * @property {string} person.firstName - Person's first name
   * @property {string} person.lastName - Person's last name
   * @property {string} person.title - Person's job title
   * @property {string} person.membership - Membership information
   * @property {Object} [person.headshot] - Headshot image object
   * @property {string} person.content - Biography content in markdown
   * @property {Array} person.tags - Array of associated tags
   * @property {boolean} displayCategory - Whether to display category information
   */
  props: {
    person: {
      type: Object,
      default: () => {}
    },
    displayCategory: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
.boldTitle {
  font-weight: 900;
  color: #555;
}
</style>
