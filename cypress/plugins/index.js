/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

require('dotenv').config()

module.exports = (on, config) => {
  config.requestTimeout = 90000
  config.defaultCommandTimeout = 60000
  config.retries.runMode = 1
  config.retries.openMode = 1
  config.env.api = `${process.env.CYPRESS_API_TENANT}${process.env.CYPRESS_API_URL}`
  return config
}
