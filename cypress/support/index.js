import 'cypress-file-upload';
import 'cypress-plugin-tab';
import UserLogin from './login';
import hasPermission from './checkPermission';
import userWizard from './userWizard';
import superUser from './superUser';
import {filterBy, filterByIndex} from './filter';
import {sortBy, sortByIndex} from './sort';

Cypress.Commands.add('login', UserLogin)
Cypress.Commands.add('wizard', userWizard)
Cypress.Commands.add('superUser', superUser)
Cypress.Commands.add('hasPermission', hasPermission)
Cypress.Commands.add('filterBy', filterBy)
Cypress.Commands.add('filterByIndex', filterByIndex)
Cypress.Commands.add('sortBy', sortBy)
Cypress.Commands.add('sortByIndex', sortByIndex)
