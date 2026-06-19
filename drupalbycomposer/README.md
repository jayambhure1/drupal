## Setup drupal with drupalbycomposer Project

 - Clone Repo `git clone git@github.com:jayambhure1/drupal.git`
 - Then checkout to `cd drupalbycomposer`
 - Open `drupal\drupalbycomposer\web\sites\default\settings.php`open update db details
 - Then Install `composer install` command
 - Then Import Database from DB folder

### Drush Command
- For Clear cache open git bash terminal run`-> vendor/bin/drush cr`
- For PHP Stand `->vendor/bin/phpstan analyse web/modules/custom/`
- for PHPCS `vendor/bin/phpcs --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml --standard=Drupal,DrupalPractice  web/modules/custom/duplicate_node`