# How to Create a Custom Theme in Drupal

A comprehensive guide to creating custom Drupal themes with best practices and examples.

## Table of Contents
- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Core Files](#core-files)
- [Creating Your First Theme](#creating-your-first-theme)
- [Twig Templates](#twig-templates)
- [Adding CSS & JS](#adding-css--js)
- [PHP Preprocess Functions](#php-preprocess-functions)
- [Theme Regions](#theme-regions)
- [Enabling the Theme](#enabling-the-theme)
- [Best Practices](#best-practices)
- [Resources](#resources)

---

## Overview
A Drupal theme controls the **presentation layer** of a Drupal site. It defines HTML structure, CSS and JS assets, template overrides, and the available page regions.

Custom themes are typically placed under `web/themes/custom/<theme_name>` in Composer-managed Drupal projects.

A theme can:
- Provide layout and page structure
- Add custom assets via libraries
- Override Twig templates
- Implement preprocess logic in PHP
- Use a base theme or sub-theme for shared features

---

## Directory Structure

A simple custom theme looks like this:

```
web/themes/custom/my_theme/
  my_theme.info.yml
  my_theme.libraries.yml
  my_theme.theme
  my_theme.breakpoints.yml
  screenshot.png
  css/
    style.css
  js/
    script.js
  templates/
    page.html.twig
    node.html.twig
    block.html.twig
```

Common folders:
- `templates/` for Twig templates
- `css/` and `js/` for custom assets
- `images/` for theme images
- `src/` for PHP theme classes if needed

---

## Core Files

### `my_theme.info.yml`
Defines the theme and its metadata. Example:

```yaml
name: My Theme
type: theme
description: 'A custom Drupal theme.'
package: Custom
core_version_requirement: '^10 || ^11'
base theme: classy
regions:
  header: 'Header'
  primary_menu: 'Primary menu'
  content: 'Content'
  sidebar_first: 'Sidebar first'
  footer: 'Footer'
libraries:
  - my_theme/global-styling
```

### `my_theme.libraries.yml`
Registers CSS/JS libraries and attaches them to the theme.

```yaml
global-styling:
  css:
    theme:
      css/style.css: {}
  js:
    js/script.js: {}
  dependencies:
    - core/drupal
    - core/jquery
```

### `my_theme.theme`
Contains PHP preprocess functions and theme hook suggestions.

```php
<?php

use Drupal\Core\Template\Attribute;

function my_theme_preprocess_html(array &$variables) {
  $variables['classes'][] = 'my-theme';
}
```

### `screenshot.png`
A preview image shown on the Appearance page.

---

## Creating Your First Theme

1. Create the folder: `web/themes/custom/my_theme`
2. Add `my_theme.info.yml` with theme metadata and regions.
3. Add `my_theme.libraries.yml` for CSS/JS.
4. Create a minimal `templates/page.html.twig` and `my_theme.theme`.
5. Optionally add `screenshot.png`.
6. Clear caches: `drush cr` or use the admin UI.
7. Enable the theme: `Appearance > Install and set as default` or `drush theme:enable my_theme`.

---

## Twig Templates

Twig templates control markup output. Common templates:
- `html.html.twig`
- `page.html.twig`
- `node.html.twig`
- `block.html.twig`
- `field.html.twig`

Use naming conventions to target specific content types:
- `node--article.html.twig`
- `block--system-menu-block.html.twig`
- `page--front.html.twig`

Enable Twig debugging in `services.yml` to see template suggestions.

Example `page.html.twig`:

```twig
<header>
  {{ page.header }}
</header>
<main>
  {{ page.content }}
</main>
<footer>
  {{ page.footer }}
</footer>
```

---

## Adding CSS & JS

Register assets in `my_theme.libraries.yml` and attach them via `.info.yml` or Twig.

Example `my_theme.libraries.yml`:

```yaml
global-styling:
  css:
    theme:
      css/style.css: {}
  js:
    js/script.js: {}
```

Attach globally from `my_theme.info.yml`:

```yaml
libraries:
  - my_theme/global-styling
```

Or attach in Twig:

```twig
{{ attach_library('my_theme/global-styling') }}
```

Use Drupal libraries for dependency management and avoid inline scripts/styles.

---

## PHP Preprocess Functions

Preprocess functions modify variables before the template renders.

Example in `my_theme.theme`:

```php
<?php

function my_theme_preprocess_page(array &$variables) {
  $variables['site_name'] = \Drupal::config('system.site')->get('name');
}
```

Common preprocess hooks:
- `hook_preprocess_html`
- `hook_preprocess_page`
- `hook_preprocess_node`
- `hook_preprocess_block`

Add theme suggestions:

```php
function my_theme_theme_suggestions_page(array $variables) {
  if (\Drupal::service('path.matcher')->isFrontPage()) {
    $variables['theme_hook_suggestions'][] = 'page__front';
  }
}
```

---

## Theme Regions

Define regions in the `.info.yml` file and render them in `page.html.twig`.

Example region definitions:

```yaml
regions:
  header: 'Header'
  primary_menu: 'Primary menu'
  content: 'Content'
  sidebar_first: 'Sidebar first'
  footer: 'Footer'
```

Render regions in Twig:

```twig
{% if page.primary_menu %}
  <nav>{{ page.primary_menu }}</nav>
{% endif %}
```

Regions let site builders place blocks from the UI.

---

## Enabling the Theme

Via the admin UI:
- Go to `Appearance`
- Click `Install and set as default` or enable the theme
- Configure the theme settings if available

Via Drush:
- `drush theme:enable my_theme`
- `drush config-set system.theme default my_theme`
- `drush cr`

If you change templates or theme files, clear cache after each update.

---

## Best Practices

- Use a base theme when available instead of copying core markup.
- Keep templates small and presentational.
- Use libraries for CSS/JS and avoid inline markup.
- Use Twig debug mode for template suggestions.
- Define theme regions and avoid hard-coding layout.
- Keep preprocess functions simple and focused on variable preparation.
- Use semantic HTML and accessible markup.
- Keep asset filenames and library names consistent.

---

## Resources

- Drupal theming guide: https://www.drupal.org/docs/theming-drupal
- Twig in Drupal: https://www.drupal.org/docs/theming-drupal/twig-in-drupal
- Drupal 10/11 theme development: https://www.drupal.org/docs/drupal-10
- Drupal API reference: https://api.drupal.org

