# How to Create Custom Module in Drupal

A comprehensive guide to creating custom Drupal modules with best practices and examples.

## Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Core Files](#core-files)
- [Creating Your First Module](#creating-your-first-module)
- [Module Hooks](#module-hooks)
- [Creating Routes](#creating-routes)
- [Creating Forms](#creating-forms)
- [Database Operations](#database-operations)
- [Testing](#testing)
- [Best Practices](#best-practices)
- [Resources](#resources)

## Overview

A Drupal module is a collection of PHP files and configuration that extends Drupal's functionality. Modules can:
- Add new content types and fields
- Create custom pages and routes
- Add new forms and configuration screens
- Alter existing functionality
- Provide custom blocks and views
- Integrate with external APIs

## Directory Structure

```
drupalbycomposer/web/modules/custom/my_module/
├── src/
│   ├── Form/
│   │   ├── MyModuleForm.php
│   │   └── MyModuleSettingsForm.php
│   ├── Plugin/
│   │   ├── Block/
│   │   │   └── MyModuleBlock.php
│   │   └── Field/
│   │       └── FieldType/
│   ├── Controller/
│   │   └── MyModuleController.php
│   └── Service/
│       └── MyModuleService.php
├── config/
│   ├── install/
│   │   ├── my_module.settings.yml
│   │   └── views.view.my_view.yml
│   └── schema/
│       └── my_module.schema.yml
├── templates/
│   ├── my-module-template.html.twig
│   └── my-module-block.html.twig
├── tests/
│   ├── Unit/
│   │   └── MyModuleUnitTest.php
│   └── Functional/
│       └── MyModuleFunctionalTest.php
├── my_module.info.yml
├── my_module.module
├── my_module.permissions.yml
├── my_module.routing.yml
├── my_module.services.yml
├── my_module.links.menu.yml
└── README.md
```

## Core Files

### 1. my_module.info.yml

**Purpose**: Defines module metadata and configuration.

```yaml
name: My Custom Module
type: module
description: Provides custom functionality for the site
core_version_requirement: ^9 || ^10
version: 1.0.0

package: Custom

# Module dependencies
dependencies:
  - drupal:views
  - drupal:block
  - drupal:user

# Configure this module
configure: my_module.admin_settings

# Module weight (0 = normal, higher = loads later)
weight: 0

# PHP and PHP extensions required
php: 8.0
```

**Key Fields:**
- `name` - Human-readable module name
- `type` - Always "module"
- `description` - Short description of functionality
- `core_version_requirement` - Drupal versions supported (^9 || ^10 means 9.x and 10.x)
- `dependencies` - Other modules required
- `configure` - Route to module settings page
- `package` - Grouping category

### 2. my_module.module

**Purpose**: Contains module hooks and callbacks.

```php
<?php

/**
 * @file
 * Primary module hooks for My Module module.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_help().
 */
function my_module_help($route_name, \Drupal\Core\Routing\RouteMatchInterface $route_match) {
  switch ($route_name) {
    case 'help.page.my_module':
      $text = file_get_contents(__DIR__ . '/README.md');
      if (!\Drupal::moduleHandler()->moduleExists('markdown')) {
        return '<pre>' . $text . '</pre>';
      }
      else {
        // Use the Markdown module to parse the README.
        $filter_manager = \Drupal::service('plugin.manager.filter');
        $settings = \Drupal::configFactory()->get('markdown.settings');
        $config = $settings->getRawData();
        $definition = $filter_manager->getDefinition('markdown');
        $filter = $filter_manager->createInstance('markdown', ['settings' => $config]);
        return $filter->process($text, 'markdown');
      }
  }
  return NULL;
}

/**
 * Implements hook_theme().
 */
function my_module_theme($existing, $type, $theme, $path) {
  return [
    'my_module_block' => [
      'variables' => [
        'title' => NULL,
        'content' => NULL,
      ],
      'template' => 'my-module-block',
    ],
  ];
}

/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(&$form, FormStateInterface $form_state, $form_id) {
  if ($form_id === 'node_article_form') {
    // Add custom validation to article forms
    $form['#validate'][] = 'my_module_node_form_validate';
  }
}

/**
 * Custom validation for node forms.
 */
function my_module_node_form_validate(&$form, FormStateInterface $form_state) {
  $title = $form_state->getValue('title');
  if (strlen($title[0]['value']) < 5) {
    $form_state->setErrorByName('title', t('Title must be at least 5 characters long.'));
  }
}

/**
 * Implements hook_preprocess_HOOK().
 */
function my_module_preprocess_node(&$variables) {
  $node = $variables['node'];
  $variables['custom_class'] = 'node-' . $node->bundle();
}
```

### 3. my_module.routing.yml

**Purpose**: Defines routes (URLs) for module pages and controllers.

```yaml
# Admin settings page
my_module.admin_settings:
  path: '/admin/config/my-module/settings'
  defaults:
    _form: '\Drupal\my_module\Form\MyModuleSettingsForm'
    _title: 'My Module Settings'
  requirements:
    _permission: 'administer my module'

# Custom page
my_module.custom_page:
  path: '/my-module/custom'
  defaults:
    _controller: '\Drupal\my_module\Controller\MyModuleController::customPage'
    _title: 'Custom Page'
  requirements:
    _access: 'TRUE'

# User-specific page with parameter
my_module.user_page:
  path: '/my-module/user/{user}'
  defaults:
    _controller: '\Drupal\my_module\Controller\MyModuleController::userPage'
    _title: 'User Page'
  requirements:
    _permission: 'access my module user pages'
    user: '\d+'
```

### 4. my_module.services.yml

**Purpose**: Defines services (reusable classes) for dependency injection.

```yaml
services:
  my_module.settings:
    class: Drupal\my_module\MyModuleSettings
    arguments: ['@config.factory']

  my_module.service:
    class: Drupal\my_module\Service\MyModuleService
    arguments:
      - '@database'
      - '@entity_type.manager'
      - '@current_user'

  my_module.form_processor:
    class: Drupal\my_module\Service\FormProcessor
    arguments: ['@logger.channel.my_module']
```

### 5. my_module.permissions.yml

**Purpose**: Defines custom permissions.

```yaml
administer my module:
  title: 'Administer My Module'
  description: 'Access module settings and configuration'

access my module user pages:
  title: 'Access My Module User Pages'
  description: 'View user-specific pages'

create my module content:
  title: 'Create My Module Content'
  description: 'Create new content via My Module'
```

### 6. my_module.links.menu.yml

**Purpose**: Defines menu links.

```yaml
my_module.admin:
  title: 'My Module'
  parent: system.admin_config_system
  description: 'Configure My Module settings'
  route_name: my_module.admin_settings
  weight: 10

my_module.custom:
  title: 'Custom Page'
  route_name: my_module.custom_page
  weight: 0
```

## Creating Your First Module

### Step 1: Create Directory Structure

```bash
mkdir -p web/modules/custom/my_module
cd web/modules/custom/my_module
mkdir -p src/Controller src/Form src/Service config/install templates tests/{Unit,Functional}
```

### Step 2: Create my_module.info.yml

```yaml
name: My Custom Module
type: module
description: My first custom module
core_version_requirement: ^9 || ^10
version: 1.0.0
package: Custom

configure: my_module.settings
```

### Step 3: Create my_module.module

Create a minimal `.module` file:

```php
<?php

/**
 * @file
 * Primary module hooks for My Module.
 */

/**
 * Implements hook_help().
 */
function my_module_help($route_name, \Drupal\Core\Routing\RouteMatchInterface $route_match) {
  if ($route_name === 'help.page.my_module') {
    return '<p>' . t('My Module provides custom functionality.') . '</p>';
  }
}
```

### Step 4: Create my_module.routing.yml

```yaml
my_module.hello:
  path: '/hello'
  defaults:
    _controller: '\Drupal\my_module\Controller\MyModuleController::hello'
    _title: 'Hello'
  requirements:
    _access: 'TRUE'
```

### Step 5: Create Controller

Create `src/Controller/MyModuleController.php`:

```php
<?php

namespace Drupal\my_module\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for My Module.
 */
class MyModuleController extends ControllerBase {

  /**
   * Hello page callback.
   */
  public function hello() {
    return [
      '#markup' => $this->t('Hello World!'),
    ];
  }

}
```

### Step 6: Install Module

```bash
# Enable the module
vendor/bin/drush en my_module

# Clear cache
vendor/bin/drush cr
```

Visit `/hello` to see your module in action!

## Module Hooks

Common hooks used in Drupal modules:

### hook_help()
Provide help text for your module.

### hook_menu()
Define custom menu items (Drupal 7, deprecated in 8+).

### hook_theme()
Define custom theme templates.

### hook_form_alter()
Modify existing forms.

### hook_entity_insert()
Perform action after entity is created.

### hook_entity_update()
Perform action after entity is updated.

### hook_entity_delete()
Perform action after entity is deleted.

### hook_preprocess_HOOK()
Preprocess variables before template rendering.

### hook_permission()
Define custom permissions.

### hook_node_access()
Control node access.

## Creating Routes

Routes map URLs to controllers. In `my_module.routing.yml`:

```yaml
# Simple route
my_module.page:
  path: '/my-page'
  defaults:
    _controller: '\Drupal\my_module\Controller\MyController::page'
    _title: 'My Page'
  requirements:
    _permission: 'access content'

# Route with parameters
my_module.node:
  path: '/node/{node}'
  defaults:
    _controller: '\Drupal\my_module\Controller\MyController::node'
    _title: 'Node Page'
  requirements:
    _permission: 'view'
    node: '\d+'
```

## Creating Forms

### Simple Form

Create `src/Form/MyForm.php`:

```php
<?php

namespace Drupal\my_module\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class MyForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'my_module_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Name'),
      '#required' => TRUE,
    ];

    $form['email'] = [
      '#type' => 'email',
      '#title' => $this->t('Email'),
      '#required' => TRUE,
    ];

    $form['message'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Message'),
      '#rows' => 5,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
    
    $email = $form_state->getValue('email');
    if (!strpos($email, '@')) {
      $form_state->setErrorByName('email', $this->t('Invalid email.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->messenger()->addMessage($this->t('Form submitted successfully.'));
  }

}
```

### Configuration Form

Create `src/Form/SettingsForm.php`:

```php
<?php

namespace Drupal\my_module\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class SettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['my_module.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'my_module_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('my_module.settings');

    $form['site_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Site Name'),
      '#default_value' => $config->get('site_name'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('my_module.settings')
      ->set('site_name', $form_state->getValue('site_name'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
```

## Database Operations

### Using the Database Service

```php
<?php

namespace Drupal\my_module\Service;

use Drupal\Core\Database\Connection;

class MyModuleService {

  /**
   * Database service.
   */
  protected Connection $database;

  public function __construct(Connection $database) {
    $this->database = $database;
  }

  /**
   * Insert a record.
   */
  public function insertRecord($name, $email) {
    $this->database->insert('my_module_records')
      ->fields([
        'name' => $name,
        'email' => $email,
        'created' => time(),
      ])
      ->execute();
  }

  /**
   * Query records.
   */
  public function getRecords() {
    $query = $this->database->select('my_module_records', 'r');
    $query->fields('r', ['id', 'name', 'email', 'created']);
    $query->orderBy('r.created', 'DESC');
    return $query->execute()->fetchAll();
  }

  /**
   * Update a record.
   */
  public function updateRecord($id, $name, $email) {
    $this->database->update('my_module_records')
      ->fields([
        'name' => $name,
        'email' => $email,
      ])
      ->condition('id', $id)
      ->execute();
  }

  /**
   * Delete a record.
   */
  public function deleteRecord($id) {
    $this->database->delete('my_module_records')
      ->condition('id', $id)
      ->execute();
  }

}
```

### Schema Definition

Create `config/schema/my_module.schema.yml`:

```yaml
my_module.database_schema:
  type: mapping
  label: 'My Module Database Schema'
  mapping:
    my_module_records:
      type: sequence
      sequence:
        - type: mapping
          mapping:
            id:
              type: integer
              label: 'Record ID'
            name:
              type: string
              label: 'Name'
            email:
              type: string
              label: 'Email'
            created:
              type: integer
              label: 'Created Timestamp'
```

### Install/Update Hooks

Create hook implementations in `.module` file:

```php
<?php

/**
 * Implements hook_install().
 */
function my_module_install() {
  // Create custom table
  $schema = my_module_schema();
  \Drupal::database()->schema()->createTable('my_module_records', $schema['my_module_records']);
}

/**
 * Implements hook_uninstall().
 */
function my_module_uninstall() {
  // Delete custom table
  \Drupal::database()->schema()->dropTable('my_module_records');
}

/**
 * Implements hook_schema().
 */
function my_module_schema() {
  $schema['my_module_records'] = [
    'description' => 'Stores My Module records.',
    'fields' => [
      'id' => [
        'description' => 'Primary key.',
        'type' => 'serial',
        'unsigned' => TRUE,
        'not null' => TRUE,
      ],
      'name' => [
        'description' => 'Record name.',
        'type' => 'varchar',
        'length' => 255,
        'not null' => TRUE,
      ],
      'email' => [
        'description' => 'Record email.',
        'type' => 'varchar',
        'length' => 255,
        'not null' => FALSE,
      ],
      'created' => [
        'description' => 'Timestamp when created.',
        'type' => 'int',
        'unsigned' => TRUE,
        'not null' => TRUE,
      ],
    ],
    'primary key' => ['id'],
    'indexes' => [
      'email' => ['email'],
    ],
  ];

  return $schema;
}
```

## Testing

### Unit Test

Create `tests/Unit/MyModuleUnitTest.php`:

```php
<?php

namespace Drupal\Tests\my_module\Unit;

use Drupal\Tests\UnitTestCase;

class MyModuleUnitTest extends UnitTestCase {

  /**
   * Test addition.
   */
  public function testAddition() {
    $this->assertEquals(2, 1 + 1);
  }

}
```

### Functional Test

Create `tests/Functional/MyModuleFunctionalTest.php`:

```php
<?php

namespace Drupal\Tests\my_module\Functional;

use Drupal\Tests\BrowserTestBase;

class MyModuleFunctionalTest extends BrowserTestBase {

  protected $defaultTheme = 'claro';

  protected static $modules = ['my_module'];

  /**
   * Test page loads.
   */
  public function testPageLoads() {
    $this->drupalGet('/hello');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->pageTextContains('Hello World!');
  }

}
```

### Run Tests

```bash
# Run all tests
vendor/bin/phpunit

# Run specific module tests
vendor/bin/phpunit web/modules/custom/my_module/tests/

# Run specific test class
vendor/bin/phpunit web/modules/custom/my_module/tests/Unit/MyModuleUnitTest.php
```

## Best Practices

### 1. Use Dependency Injection

**Good:**
```php
public function __construct(Connection $database) {
  $this->database = $database;
}
```

**Bad:**
```php
$this->database = \Drupal::database();
```

### 2. Follow Drupal Coding Standards

```bash
# Check code standards
vendor/bin/phpcs --standard=Drupal web/modules/custom/my_module/

# Fix automatically
vendor/bin/phpcbf --standard=Drupal web/modules/custom/my_module/
```

### 3. Use Configuration API

Store settings in YAML config files, not hardcoded.

### 4. Document Your Code

Use PHPDoc comments for all classes, functions, and methods.

### 5. Use Translation Strings

Always wrap user-facing text with `$this->t()` or `t()`.

### 6. Handle Permissions

Always check permissions before performing actions.

### 7. Use Hooks Appropriately

Don't override core functionality when hooks suffice.

### 8. Cache Results

Use Drupal's caching API for expensive operations.

```php
$cache_id = 'my_module_data';
if ($cache = \Drupal::cache()->get($cache_id)) {
  $data = $cache->data;
} else {
  $data = expensive_operation();
  \Drupal::cache()->set($cache_id, $data, CacheBackendInterface::CACHE_PERMANENT);
}
```

## Resources

- [Drupal Module Development Guide](https://www.drupal.org/docs/drupal-apis/module-system)
- [Drupal API Documentation](https://api.drupal.org/)
- [Drupal Best Practices](https://www.drupal.org/docs/drupal-apis/coding-standards)
- [Drupal Form API](https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Form%21FormBase.php)
- [Drupal Routing System](https://www.drupal.org/docs/drupal-apis/routing-system)