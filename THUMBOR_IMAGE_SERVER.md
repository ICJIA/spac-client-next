# Thumbor Image Server

**📅 Last Updated**: October 23, 2025

## Overview

The SPAC application uses **Thumbor**, a smart imaging service, to serve and optimize images across the website. Thumbor handles image resizing, cropping, filtering, and caching to improve performance and reduce bandwidth usage.

## Image Server Configuration

**Production Image Server**: `https://image.icjia.cloud`

**Development Image Server**: `http://localhost:8888` (when running locally)

The image server URL is configured in:
- `src/config.json` → `imageServerURL`
- `.env` → `VUE_APP_IMAGE_SERVER_URL`

## Thumbor Security Key

Thumbor uses a security key to sign image URLs and prevent unauthorized image manipulation.

### ⚠️ Important: Thumbor Security Key

The Thumbor security key is stored in:
- `.env` → `VUE_APP_THUMBOR_KEY`

**For questions about the Thumbor security key or password, please contact the previous SPAC web developer.**

The key is required for:
- Signing image URLs
- Enabling image transformations (resize, crop, filter)
- Preventing unauthorized image manipulation

## How Images Are Served

### Image URL Structure

Thumbor images are served through signed URLs:

```
https://image.icjia.cloud/unsafe/{width}x{height}/{image-url}
```

Or with security key (signed):

```
https://image.icjia.cloud/{signature}/{width}x{height}/{image-url}
```

### Example Image URLs

**Original image from CMS:**
```
https://spac.icjia-api.cloud/uploads/publication-cover-2024.png
```

**Resized via Thumbor (310x360):**
```
https://image.icjia.cloud/unsafe/310x360/spac.icjia-api.cloud/uploads/publication-cover-2024.png
```

**With smart crop:**
```
https://image.icjia.cloud/unsafe/310x360/smart/spac.icjia-api.cloud/uploads/publication-cover-2024.png
```

## Using Thumbor in Vue Components

### Image Component with Thumbor

```vue
<template>
  <img 
    :src="thumborImageUrl" 
    :alt="imageAlt"
    class="publication-thumbnail"
  />
</template>

<script>
export default {
  props: {
    imageUrl: String,
    width: {
      type: Number,
      default: 310
    },
    height: {
      type: Number,
      default: 360
    }
  },
  computed: {
    thumborImageUrl() {
      if (!this.imageUrl) {
        return this.$store.getters.config.thumbnail.defaultUrl;
      }
      
      const imageServer = this.$store.getters.config.imageServerURL;
      return `${imageServer}/unsafe/${this.width}x${this.height}/${this.imageUrl}`;
    }
  }
}
</script>
```

### Common Image Dimensions

Based on the application configuration:

- **Thumbnails**: 310x360 (publications, news)
- **Default Thumbnail**: `https://spac.icjia-api.cloud/uploads/spac-purple-small-20191015T14513293.png`
- **Headshots**: Variable (council member biographies)

## Thumbor Features

### Image Transformations

Thumbor supports various image transformations:

- **Resize**: Change image dimensions
- **Crop**: Extract specific regions
- **Smart Crop**: Automatically detect and crop important areas
- **Filters**: Apply effects (blur, brightness, contrast, etc.)
- **Format Conversion**: Convert between image formats (JPEG, PNG, WebP)
- **Quality Adjustment**: Optimize file size

### Example Transformations

**Resize with smart crop:**
```
/unsafe/310x360/smart/image-url
```

**Resize with quality adjustment:**
```
/unsafe/310x360/filters:quality(80)/image-url
```

**Resize with blur filter:**
```
/unsafe/310x360/filters:blur(2)/image-url
```

## Configuration Files

### src/config.json

```json
{
  "imageServerURL": "https://image.icjia.cloud",
  "thumbnail": {
    "defaultUrl": "https://spac.icjia-api.cloud/uploads/spac-purple-small-20191015T14513293.png",
    "defaultWidth": 310,
    "defaultHeight": 360
  }
}
```

### .env

```bash
VUE_APP_THUMBOR_KEY=<security-key>
VUE_APP_IMAGE_SERVER_URL='image.icjia.cloud'
```

## Troubleshooting

### Images Not Loading

1. **Check image URL**: Verify the original image URL is correct
2. **Check Thumbor server**: Ensure `https://image.icjia.cloud` is accessible
3. **Check security key**: Verify `VUE_APP_THUMBOR_KEY` is set in `.env`
4. **Check CORS**: Ensure Thumbor CORS headers are configured

### Broken Images

- Verify the source image exists in the CMS
- Check that the image URL is properly encoded
- Ensure the image format is supported (JPEG, PNG, WebP, GIF)

### Performance Issues

- Use appropriate image dimensions (don't request oversized images)
- Enable Thumbor caching on the server
- Consider using WebP format for modern browsers
- Optimize image quality settings

## Development

### Running Thumbor Locally

To run Thumbor locally for development:

```bash
# Install Thumbor
pip install thumbor

# Run Thumbor server
thumbor -l 0.0.0.0 -p 8888
```

Then update `.env`:
```bash
VUE_APP_IMAGE_SERVER_URL='localhost:8888'
```

### Testing Image URLs

Test Thumbor URLs directly in your browser:

```
https://image.icjia.cloud/unsafe/310x360/spac.icjia-api.cloud/uploads/test-image.png
```

## Related Documentation

- **Configuration**: See `src/config.json` for image server settings
- **Environment Variables**: See `.env.sample` for Thumbor key setup
- **Image Components**: See `src/components/` for image usage examples
- **GraphQL API**: Images are returned in content queries from Strapi CMS

## Support

**For questions about:**
- **Image server configuration**: Check this documentation or `src/config.json`
- **Thumbor security key**: Contact the previous SPAC web developer
- **Image optimization**: Refer to Thumbor documentation at https://thumbor.readthedocs.io/
- **CMS image uploads**: Contact the Strapi CMS administrator

---

**Note**: The Thumbor image server is essential for image optimization and performance. Do not modify the image server URL or security key without understanding the implications.

