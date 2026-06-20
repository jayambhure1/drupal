# Drupal by Composer - Setup & Development Guide

A Composer-based Drupal project with custom theme development and quality assurance tools.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Theme Development](#theme-development)
- [Drush Commands](#drush-commands)
- [Code Quality](#code-quality)
- [Project Structure](#project-structure)

## Installation

### Prerequisites
- PHP 7.4+ with required extensions
- Composer
- MySQL/MariaDB 5.7+
- Git

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:jayambhure1/drupal.git
   cd drupal
   ```

2. **Navigate to the project directory**
   ```bash
   cd drupalbycomposer
   ```

3. **Install Composer dependencies**
   ```bash
   composer install
   ```

## Configuration

### Database Settings

Edit `web/sites/default/settings.php` and update the following:

```php
$databases['default']['default'] = array (
  'database' => 'your_database_name',
  'username' => 'your_db_user',
  'password' => 'your_db_password',
  'host' => 'localhost',
  'port' => '3306',
  'driver' => 'mysql',
  'prefix' => '',
);
```

## Database Setup

### Import Existing Database

```bash
mysql -u username -p database_name < db/drupalbycomposer.sql
```

Or via MySQL GUI:
1. Create a new database
2. Import `db/drupalbycomposer.sql`
3. Update database credentials in `settings.php`

## Theme Development

### Custom Theme Location

`web/themes/custom/my_claro_subtheme/`

### Theme Structure

```
my_claro_subtheme/
├── css/
│   └── style.css              # Responsive theme styles
├── js/
│   └── script.js              # Theme scripts
├── templates/
│   └── page.html.twig         # Main page template
├── my_claro_subtheme.info.yml # Theme info file
├── my_claro_subtheme.theme    # Theme preprocess hooks
└── my_claro_subtheme.libraries.yml  # Asset definitions
```

### CSS Features

The theme includes responsive styles for:
- **Header**: Logo, navigation, header blocks
- **Main Content**: Multi-column layout with sidebars
- **Footer**: Footer blocks and credit section
- **Responsive Breakpoints**: 
  - Desktop (1000px+)
  - Tablet (720px - 999px)
  - Mobile (< 520px)

### Theme Customization

Edit `css/style.css` to customize:
- Colors (brand colors, backgrounds, text)
- Layout (spacing, margins, padding)
- Typography (fonts, sizes, weights)
- Responsive behavior

## Drush Commands

### Cache Management

```bash
# Clear all caches
vendor/bin/drush cr

# Clear specific cache
vendor/bin/drush cc render
```

### Configuration Management

```bash
# Export configuration to YAML
vendor/bin/drush cex

# Import configuration from YAML
vendor/bin/drush cim

# Diff configuration
vendor/bin/drush config:list
```

### Database & User Management

```bash
# Reset password
vendor/bin/drush user:password username password

# List users
vendor/bin/drush user:list
```

## Code Quality

### PHP Stan Analysis

Run static analysis on custom modules:

```bash
vendor/bin/phpstan analyse web/modules/custom/
```

### PHP CodeSniffer (PHPCS)

Check code against Drupal standards:

```bash
vendor/bin/phpcs --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --standard=Drupal,DrupalPractice web/modules/custom/
```

Check specific module:

```bash
vendor/bin/phpcs --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --standard=Drupal,DrupalPractice web/modules/custom/module_name
```

Fix code automatically:

```bash
vendor/bin/phpcbf --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --standard=Drupal,DrupalPractice web/modules/custom/
```

## Project Structure

```
drupalbycomposer/
├── web/                      # Drupal root
│   ├── core/                 # Drupal core files
│   ├── modules/              # Contributed modules
│   │   └── custom/           # Custom modules
│   ├── themes/               # Themes
│   │   └── custom/
│   │       └── my_claro_subtheme/
│   ├── sites/
│   │   └── default/
│   │       ├── settings.php  # Database config
│   │       └── files/        # User uploads
│   └── index.php             # Drupal entry point
├── vendor/                   # Composer packages
├── db/
│   └── drupalbycomposer.sql  # Database export
├── recipes/                  # Drupal recipes
├── composer.json             # Composer configuration
├── composer.lock             # Dependency lock file
└── README.md                 # This file
```

## Troubleshooting

### Permission Issues

```bash
# Fix file permissions on Linux/Mac
chmod -R 755 web/sites/default/files
chown -R www-data:www-data web/sites/default/files
```

### Cache Issues

```bash
# Full cache rebuild
vendor/bin/drush cache:rebuild
```

### Theme Not Updating

1. Clear Drupal cache: `vendor/bin/drush cr`
2. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
3. Check that the theme is enabled in admin panel

## Support & Resources

- [Drupal Documentation](https://www.drupal.org/documentation)
- [Drush Documentation](https://www.drush.org/latest/)
- [Composer Documentation](https://getcomposer.org/doc/)