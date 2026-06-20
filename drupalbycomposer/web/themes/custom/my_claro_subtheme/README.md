# My Claro Subtheme

A custom Drupal theme based on Claro with responsive design and modern styling.

## About

This is a sub-theme of Drupal's Claro theme, featuring:
- Clean, modern design
- Fully responsive layout
- Professional color scheme
- Easy-to-customize CSS

## Features

### Responsive Design

The theme includes three responsive breakpoints:
- **Desktop**: 1000px and above
- **Tablet**: 720px to 999px
- **Mobile**: Below 520px

### Layout Components

- **Header**: Navigation menu with logo
- **Main Content**: Flexible multi-column layout
- **Sidebar**: Optional left and right sidebars
- **Footer**: Footer blocks with credit section

### CSS Customization

All styling is organized in `css/style.css`:
- Global resets and typography
- Header and navigation styles
- Main content layout
- Sidebar styling
- Footer styling
- Media queries for responsiveness

## File Structure

```
my_claro_subtheme/
├── css/
│   └── style.css                      # Main stylesheet
├── js/
│   └── script.js                      # Theme JavaScript
├── templates/
│   ├── page.html.twig                 # Main page template
│   ├── (additional templates)
├── my_claro_subtheme.info.yml         # Theme metadata
├── my_claro_subtheme.theme            # Theme hooks and preprocessing
├── my_claro_subtheme.libraries.yml    # Asset library definitions
└── README.md                          # This file
```

## Customization

### Colors

Edit `css/style.css` to change color values:

- Primary color: `#0f4c81` (blue)
- Background: `#ffffff` (white)
- Text: `#111111` (dark)
- Borders: `#e3e3e6` (light gray)
- Footer: `#031d3d` (dark blue)

### Typography

Font families and sizes are defined in the `html` and element selectors. Modify as needed:

```css
html {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}
```

### Spacing

Adjust padding and margins throughout the theme by modifying the `rem` values in utility classes and component styles.

## Theme Development

### Enabling the Theme

1. Go to **Administration > Appearance**
2. Find "My Claro Subtheme" in the list
3. Click "Install and set as default"

### Clearing Cache

After making CSS changes, clear Drupal's cache:

```bash
vendor/bin/drush cr
```

Also clear your browser cache (Ctrl+F5 or Cmd+Shift+R).

### Adding Custom Styles

Add custom CSS to `css/style.css`. The file uses semantic sections:
- Global reset and base layout
- Header
- Main content structure
- Footer
- Responsive breakpoints

### Template Modifications

Edit `templates/page.html.twig` to modify the page structure. Twig filters and functions are available for rendering Drupal regions and variables.

### JavaScript

Add custom scripts to `js/script.js`. Include this file in `my_claro_subtheme.libraries.yml` to ensure it's loaded.

## Browser Support

The theme uses modern CSS features including:
- CSS Grid
- Flexbox
- CSS Custom Properties (Variables)
- Media Queries

**Supported browsers:**
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Troubleshooting

### Theme Not Applying

1. Clear Drupal cache: `vendor/bin/drush cr`
2. Clear browser cache
3. Verify theme is set as default in **Appearance** settings

### CSS Not Updating

- Check that `css/style.css` is properly enqueued in `my_claro_subtheme.libraries.yml`
- Ensure the file path is correct
- Clear all caches

### Responsive Issues

- Check media query breakpoints in `css/style.css`
- Test on different screen sizes using browser DevTools
- Verify viewport meta tag is present in page template

## Resources

- [Drupal Theme Guide](https://www.drupal.org/docs/drupal-apis/theme-system)
- [Twig Documentation](https://twig.symfony.com/doc/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## License

This theme is part of the Drupal by Composer project. See the main project README for license information.
