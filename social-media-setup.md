# Social Media Preview Setup Guide

Your blog now supports rich social media previews! Here's what you need to do to make it work:

## 1. Create Image Assets

You need to create the following images:

### Main Blog Image (Required)
- **File**: `images/og-image.jpg`
- **Size**: 1200x630 pixels (16:9 aspect ratio)
- **Purpose**: Default image for the blog homepage and posts without specific images
- **Content**: Your lab logo, blog title, or a generic research/AI theme

### Individual Post Images (Optional)
- **Size**: 1200x630 pixels (16:9 aspect ratio)
- **Format**: JPG or PNG
- **Naming**: Use descriptive names like `constrained-rl-preview.jpg`
- **Location**: `images/` directory

## 2. Update Blog Post Frontmatter

Add an `image` field to your blog post frontmatter:

```yaml
---
title: "Your Post Title"
date: "2025-01-15"
author: "Author Name"
tags: ["tag1", "tag2"]
excerpt: "A compelling excerpt that will appear in social media previews."
featured: false
image: "https://improbable-ai.github.io/images/your-post-preview.jpg"
---
```

## 3. Test Your Social Media Previews

### Facebook/LinkedIn Debugger
- Visit: https://developers.facebook.com/tools/debugger/
- Enter your blog URL and click "Debug"
- Click "Scrape Again" to refresh the cache

### Twitter Card Validator
- Visit: https://cards-dev.twitter.com/validator
- Enter your blog URL to see how it will appear on Twitter

### Slack
- Share your blog URL in a Slack channel
- The preview should appear automatically

### iMessage
- Send your blog URL to yourself or others
- The rich preview should appear

## 4. Image Creation Tips

### Design Guidelines
- **Text**: Keep text large and readable (minimum 24px)
- **Colors**: Use high contrast for better visibility
- **Branding**: Include your lab logo or name
- **Content**: Use relevant imagery (robots, AI, research, etc.)

### Tools for Creating Images
- **Canva**: Free online design tool with social media templates
- **Figma**: Professional design tool with free tier
- **Photoshop**: Professional image editing
- **GIMP**: Free alternative to Photoshop

### Quick Template
Create a 1200x630 template with:
- Background: Dark theme with subtle patterns
- Logo: Your lab logo in top-left corner
- Title: Large, bold text for post titles
- Subtitle: Smaller text for excerpts
- Accent: AI/robotics themed graphics

## 5. What's Already Implemented

Your blog now includes:

### Open Graph Tags
- `og:type` - Set to "article" for posts, "website" for homepage
- `og:title` - Post title or blog title
- `og:description` - Post excerpt or blog description
- `og:image` - Post image or default image
- `og:url` - Full URL to the post
- `og:site_name` - "Improbable AI Research Lab"

### Twitter Card Tags
- `twitter:card` - Set to "summary_large_image"
- `twitter:title` - Post title
- `twitter:description` - Post excerpt
- `twitter:image` - Post image
- `twitter:url` - Full URL to the post

### Additional Meta Tags
- `article:published_time` - Post publication date
- `article:author` - Post author
- `article:tag` - Post tags (multiple)
- `canonical` - Canonical URL for SEO

## 6. Dynamic Updates

The JavaScript automatically:
- Updates meta tags when viewing individual posts
- Resets meta tags when returning to blog list
- Handles URL changes for direct post access
- Truncates descriptions to fit social media limits (160 characters)

## 7. Troubleshooting

### Images Not Showing
- Check image URLs are absolute (https://...)
- Verify images are publicly accessible
- Ensure images are 1200x630 pixels
- Clear social media cache using debuggers

### Meta Tags Not Updating
- Check browser console for JavaScript errors
- Verify post frontmatter is correctly formatted
- Test with a hard refresh (Ctrl+F5)

### Platform-Specific Issues
- **Facebook**: Use Facebook Debugger to refresh cache
- **Twitter**: Use Twitter Card Validator
- **LinkedIn**: Use Facebook Debugger (LinkedIn uses same system)
- **Slack**: Usually works automatically, may need to wait

## 8. Example Post with Image

Here's how a complete post frontmatter should look:

```yaml
---
title: "Advancing Robotic Locomotion with Deep Learning"
date: "2025-01-15"
author: "Dr. Sarah Chen"
tags: ["robotics", "deep-learning", "locomotion"]
excerpt: "We present a novel approach to robotic locomotion using deep reinforcement learning, achieving unprecedented stability and efficiency in quadruped robots."
featured: true
image: "https://improbable-ai.github.io/images/robotic-locomotion-preview.jpg"
---
```

## 9. Next Steps

1. Create your main `og-image.jpg` (1200x630)
2. Add `image` fields to existing blog posts
3. Test with social media debuggers
4. Create custom images for featured posts
5. Monitor how your posts appear when shared

Your blog will now show beautiful, informative previews when shared on any social platform! 