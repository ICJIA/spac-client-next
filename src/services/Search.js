/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { EventBus } from "@/event-bus";

const searchIndexPromise = process.BROWSER_BUILD
  ? import("@/api/searchIndex.json")
  : Promise.resolve(require("@/api/searchIndex.json"));

const configPromise = process.BROWSER_BUILD
  ? import("@/config.json")
  : Promise.resolve(require("@/config.json"));

const strapiEnumToCategory = function(contentType, strapiEnum) {
  console.log(config.categoryEnums["publications"]);
  return strapiEnum;
};

const getSearchIndex = async () => {
  try {
    let searchIndex = await searchIndexPromise;

    let pages = searchIndex["pages"].map(item => {
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

    let news = searchIndex["news"].map(item => {
      item.parentPath = "/news";
      return item;
    });

    let meetings = searchIndex["meetings"].map(item => {
      item.parentPath = `/meetings/${item.category}`;
      return item;
    });

    let biographies = searchIndex["biographies"].map(item => {
      item.parentPath = "/biographies";
      return item;
    });

    let publications = searchIndex["publications"].map(item => {
      item.parentPath = `/publications/${item.category}`;
      return item;
    });

    return [...news, ...pages, ...meetings, ...biographies, ...publications];
  } catch (e) {
    EventBus.$emit("Search service error: ", e.toString());
    console.log(e.toString());
    return [];
  }
};

export { getSearchIndex };
