/**
 * @fileoverview Search service for the SPAC application.
 * Provides functionality to load and process the search index for client-side search.
 * Transforms content items by adding parent paths for proper URL generation.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { EventBus } from "@/event-bus";
import { strapiEnumToObject } from "@/services/Utilities";

/**
 * Promise that resolves to the search index data.
 * Uses dynamic import for browser builds, require for server builds.
 *
 * @type {Promise<Object>}
 */
const searchIndexPromise = process.BROWSER_BUILD
  ? import("@/api/searchIndex.json")
  : Promise.resolve(require("@/api/searchIndex.json"));

/**
 * Promise that resolves to the application configuration.
 * Uses dynamic import for browser builds, require for server builds.
 *
 * @type {Promise<Object>}
 */
const configPromise = process.BROWSER_BUILD
  ? import("@/config.json")
  : Promise.resolve(require("@/config.json"));

/**
 * Loads and processes the search index for client-side search functionality.
 * Transforms all content items by adding appropriate parent paths for URL generation.
 * Combines pages, news, meetings, biographies, publications, sections, and tags into a unified search index.
 *
 * @async
 * @function
 * @returns {Promise<Array>} Array of all searchable content items with parent paths
 * @throws {Error} Emits search service error event on failure
 * @example
 * const searchData = await getSearchIndex();
 * // Returns array of items like:
 * // [
 * //   { title: "News Article", parentPath: "/news", slug: "article-slug", ... },
 * //   { title: "Page Title", parentPath: "/section", slug: "page-slug", ... }
 * // ]
 */
const getSearchIndex = async () => {
  try {
    const searchIndex = await searchIndexPromise;

    const pages = searchIndex["pages"].map(item => {
      if (item.slug === "home") {
        item.parentPath = "/";
      } else {
        if (item.section) {
          if (item.slug === item.section.slug) {
            item.parentPath = `/`;
          } else {
            item.parentPath = `/${item.section.slug}`;
          }
        }

        // else {
        //   item.parentPath = `/resources`;
        // }
      }
      return item;
    });

    const news = searchIndex["news"].map(item => {
      item.parentPath = "/news";
      return item;
    });

    const sections = searchIndex["sections"].map(item => {
      item.parentPath = "";
      return item;
    });

    const tags = searchIndex["tags"].map(item => {
      item.parentPath = `/tags`;
      return item;
    });

    const meetings = searchIndex["meetings"].map(item => {
      const categoryObj = strapiEnumToObject("meetings", item.category);
      item.parentPath = `/meetings/${categoryObj[0].slug}`;
      return item;
    });

    const biographies = searchIndex["biographies"].map(item => {
      item.parentPath = "/about/biographies";
      return item;
    });

    const publications = searchIndex["publications"].map(item => {
      const categoryObj = strapiEnumToObject("publications", item.category);
      item.parentPath = `/publications/${categoryObj[0].slug}`;
      return item;
    });
    console.dir(pages);
    return [
      ...news,
      ...pages,
      ...meetings,
      ...biographies,
      ...publications,
      ...sections,
      ...tags
    ];
  } catch (e) {
    EventBus.$emit("Search service error: ", e.toString());
    // eslint-disable-next-line no-console
    console.log(e.toString());
    return [];
  }
};

export { getSearchIndex };
