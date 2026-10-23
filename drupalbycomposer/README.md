# Drupal by Composer - DDEV Setup & Development Guide

A Composer-based Drupal 11 project configured to run locally with DDEV.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [DDEV Commands](#ddev-commands)
- [Theme Development](#theme-development)
- [Drush Commands](#drush-commands)
- [Code Quality](#code-quality)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- [DDEV](https://ddev.readthedocs.io/en/stable/) installed
- Docker or a compatible container runtime supported by DDEV
- Git

DDEV is configured in `.ddev/config.yaml` to use PHP 8.3, MariaDB 11.8, and the `web` directory as the document root. You do not need to install PHP, Composer, or MariaDB on your host machine.

## Installation

Run these commands from the directory where you want the repository:

```bash
git clone git@github.com:jayambhure1/drupal.git
cd drupal/drupalbycomposer
ddev start
ddev composer install
```

The project will be available at <https://drupalbycomposer.ddev.site>. If DDEV reports a different URL, use the URL shown by `ddev describe`.

## Database Setup

The repository includes a database export at `db/db.sql.gz`. Import it after starting DDEV:

```bash
ddev import-db --file=db/db.sql.gz
ddev drush cr
```

Importing a database replaces the current DDEV database. To import a different SQL or compressed SQL dump, pass its path to `--file`.

DDEV supplies the database connection settings automatically through `settings.ddev.php`. Do not edit database credentials in `web/sites/default/settings.php` for local development.

To export the current database:

```bash
ddev export-db --file=db/db.sql.gz
```

## DDEV Commands

Run these commands from `drupalbycomposer/`:

```bash
# Start the project
ddev start

# Stop the project
ddev stop

# Open the project URL in a browser
ddev launch

# Show project URLs and service status
ddev describe

# Open a shell in the web container
ddev ssh
```

Run Composer commands in the DDEV web container, for example:

```bash
ddev composer require drupal/module_name
ddev composer update
```

## Theme Development

The custom theme is located at `web/themes/custom/my_claro_subtheme/`.

```text
my_claro_subtheme/
├── css/
│   └── style.css              # Responsive theme styles
├── js/
│   └── script.js              # Theme scripts
├── templates/
│   └── page.html.twig         # Main page template
├── my_claro_subtheme.info.yml # Theme info file
├── my_claro_subtheme.theme    # Theme preprocess hooks
└── my_claro_subtheme.libraries.yml
```

The theme includes responsive styles for the header, main content, footer, and desktop, tablet, and mobile breakpoints. Edit `css/style.css` to customize its colors, layout, typography, and responsive behavior.

After changing theme code, clear Drupal's cache:

```bash
ddev drush cr
```

## Drush Commands

Use `ddev drush` to run Drush inside the web container:

```bash
# Rebuild all caches
ddev drush cr

# Export configuration to YAML
ddev drush cex

# Import configuration from YAML
ddev drush cim

# List configuration
ddev drush config:list

# Reset a user's password
ddev drush user:password username password

# List users
ddev drush user:list
```

## Code Quality

Run static analysis on custom modules:

```bash
ddev exec vendor/bin/phpstan analyse web/modules/custom/
```

Check custom modules against Drupal coding standards:

```bash
ddev exec vendor/bin/phpcs --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --standard=Drupal,DrupalPractice web/modules/custom/
```

Check or automatically fix a specific module by replacing `web/modules/custom/` with its directory:

```bash
ddev exec vendor/bin/phpcs --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --standard=Drupal,DrupalPractice web/modules/custom/module_name

ddev exec vendor/bin/phpcbf --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --standard=Drupal,DrupalPractice web/modules/custom/
```

## Project Structure

```text
drupalbycomposer/
├── .ddev/                    # DDEV project configuration
├── web/                      # Drupal document root
│   ├── core/                 # Drupal core
│   ├── modules/              # Contributed and custom modules
│   ├── themes/               # Contributed and custom themes
│   └── sites/default/        # Site settings and uploaded files
├── vendor/                   # Composer dependencies
├── db/
│   └── db.sql.gz             # Database export
├── recipes/                  # Drupal recipes
├── composer.json             # Composer configuration
├── composer.lock             # Locked dependency versions
└── README.md                 # This file
```

## Troubleshooting

### DDEV cannot start

Make sure Docker (or your compatible container runtime) is running, then check the project status:

```bash
ddev describe
ddev start
```

### Database connection or content issues

Confirm the project is running and import the supplied database if the local database is empty:

```bash
ddev start
ddev import-db --file=db/db.sql.gz
ddev drush cr
```

### Theme changes are not visible

1. Rebuild Drupal's cache with `ddev drush cr`.
2. Clear the browser cache.
3. Confirm the theme is enabled in Drupal.

## Support & Resources

- [Drupal Documentation](https://www.drupal.org/documentation)
- [Drush Documentation](https://www.drush.org/latest/)
- [DDEV Documentation](https://ddev.readthedocs.io/en/stable/)
- [Composer Documentation](https://getcomposer.org/doc/)
