/**
 * @fileoverview Image service for the SPAC application.
 * Provides functions to generate optimized image URLs using Thumbor image server.
 * Handles thumbnails, headshots, and default images with automatic resizing and cropping.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-unused-vars */
const config = require("@/config.json");
import { EventBus } from "@/event-bus.js";
import axios from "axios";

const ThumborUrlBuilder = require("thumbor-url-builder");

/**
 * Thumbor URL builder instance configured with security key and image server URL.
 * Used to generate optimized image URLs with resizing, cropping, and filtering capabilities.
 *
 * @type {ThumborUrlBuilder}
 */
const thumborURL = new ThumborUrlBuilder(
  process.env.VUE_APP_THUMBOR_KEY,
  `${config.imageServerURL}`
);

/**
 * Generates a thumbnail image URL for media material.
 * Uses the provided thumbnail or falls back to default image.
 * Automatically handles PDF files by using default thumbnail.
 *
 * @function
 * @param {Object} mediaMaterial - Media material object
 * @param {Object} [mediaMaterial.thumbnail] - Thumbnail object
 * @param {string} [mediaMaterial.thumbnail.url] - Thumbnail URL path
 * @returns {string} Optimized thumbnail URL from Thumbor server
 * @example
 * const thumbnailUrl = getThumbnailLink({
 *   thumbnail: { url: '/uploads/image.jpg' }
 * });
 */
const getThumbnailLink = function(mediaMaterial) {
  let imagePath;
  if (mediaMaterial && mediaMaterial.thumbnail) {
    imagePath = `${config.baseURL}${mediaMaterial.thumbnail.url}`;
  } else {
    imagePath = config.thumbnail.defaultUrl;
  }
  const ext = imagePath.substr(imagePath.lastIndexOf(".") + 1);
  if (ext === "pdf") {
    imagePath = config.thumbnail.defaultUrl;
  }
  const link = thumborURL
    .setImagePath(`${imagePath}`)
    .resize(config.thumbnail.defaultWidth, config.thumbnail.defaultHeight)
    .smartCrop(false)
    .buildUrl();
  return link;
};

/**
 * Generates a default thumbnail image URL.
 * Always returns the configured default thumbnail image, resized to standard dimensions.
 *
 * @function
 * @param {Object} mediaMaterial - Media material object (unused but kept for consistency)
 * @returns {string} Default thumbnail URL from Thumbor server
 */
const getDefaultThumbnail = function(mediaMaterial) {
  const imagePath = config.thumbnail.defaultUrl;

  const link = thumborURL
    .setImagePath(`${imagePath}`)
    .resize(config.thumbnail.defaultWidth, config.thumbnail.defaultHeight)
    .smartCrop(false)
    .buildUrl();
  return link;
};

/**
 * Generates an optimized headshot image URL.
 * Creates a square, grayscale headshot image with smart cropping.
 *
 * @function
 * @param {Object} headshot - Headshot object
 * @param {string} headshot.url - Headshot image URL path
 * @returns {string} Optimized headshot URL from Thumbor server (85x85, grayscale)
 * @example
 * const headshotUrl = getHeadshotLink({
 *   url: '/uploads/headshot.jpg'
 * });
 */
const getHeadshotLink = function(headshot) {
  const imagePath = headshot.url;
  const link = thumborURL
    .setImagePath(`${config.baseURL}${imagePath}`)
    .resize(85, 85)
    .smartCrop(true)
    .filter("grayscale()")
    .buildUrl();

  return link;
};

export { getHeadshotLink, getThumbnailLink, getDefaultThumbnail };
