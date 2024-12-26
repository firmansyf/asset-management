/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

function AddEditform(){
  cy.get('.modal.show').find('input[name="name"]').type('Test Setting', {force : true})
  cy.get('#module_guid').type('{downarrow}{enter}', {force: true})
  cy.get('#module_field_guid').type('{downarrow}{enter}', {force: true})
  cy.get('#alert_type_guids').type('{downarrow}{enter}', {force: true})
  cy.get('input[name="start_time"]').type(moment().format('HH:mm'), {force: true})
  cy.get('input[name="end_time"]').type(moment().add(5, 'h').add(5, 'm').format('HH:mm'), {force: true})
  cy.get('#daily').check({force: true})
  cy.get('input[name="wednesday"], input[name="friday"], input[name="saturday"]').check({force: true})
  cy.get('#team_guid').type('{downarrow}{enter}', {force: true})
  cy.get('input[name="is_active"]').check({force: true})
  cy.get('.modal.show').find('button[type="submit"]').click({force: true})
}

describe('Setup Alert Setting', () => {
  beforeEach(() => {
    cy.visit('setup/alert/setting')
    cy.intercept('GET', '**/setting/alert*').as('getAlertSetting')
    cy.intercept('POST', '**/setting/alert').as('addAlertSetting')
    cy.intercept('PUT', '**/setting/alert/**').as('editAlertSetting')
    cy.intercept('DELETE', '**/setting/alert/**').as('deleteAlertSetting')
  })

  it('Setup Alert Setting', () => {
    cy.wait('@getAlertSetting').its('response.statusCode').should('eq', 200)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Add Alert Setting', () => {
    cy.get('[data-cy=add]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    AddEditform()
    cy.wait('@addAlertSetting').its('response.statusCode').should('be.oneOf', [200, 201, 422])
    cy.wait('@getAlertSetting')
  })

  it.only('Add Alert Setting ( Check Notif Mandatory )', () => {
    cy.wait('@getAlertSetting')

    cy.wait(1000)
    cy.get('button').contains('Add New Alert Setting').click({force: true})  
    cy.wait(1000)
    cy.get('.modal.show').find('button[type="submit"]').click({force: true}) 
    
    cy.wait(2000)
    cy.contains('This name is required').should('exist')
    cy.contains('This module is required').should('exist')
    cy.contains('This field is required').should('exist')
    cy.contains('This alert type is required').should('exist')
    cy.contains('This start time is required').should('exist')
    cy.contains('This end time is required').should('exist')
    cy.contains('This team is required').should('exist')
  })

  it('Update Alert Setting', () => {
    cy.get(':nth-child(1) > .text-center > .d-flex > [data-cy=editTable]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    AddEditform()
    cy.wait('@editAlertSetting').its('response.statusCode').should('be.oneOf', [200, 201, 422])
    cy.wait('@getAlertSetting')
  })

  it('Delete Alert Setting', () => {
    cy.wait('@getAlertSetting')
    cy.get(':nth-child(1) > .text-center > .d-flex > [data-cy=deleteTable').click({force: true})
    cy.get('.modal.show').find('button[type="submit"]').click({force: true})
    cy.wait('@deleteAlertSetting').its('response.statusCode').should('be.oneOf', [200, 201])
    cy.wait('@getAlertSetting')
  })
})

describe('Sort Alert Setting', () => {
  beforeEach(() => {
    cy.visit('setup/alert/setting')
    cy.intercept('GET', '**/setting/alert*').as('getAlertSetting')
  })

  it('Alert Name', () => cy.sortBy('Alert Name', '@getAlertSetting'))
  it('Module', () => cy.sortBy('Module', '@getAlertSetting'))
  it('Field', () => cy.sortBy('Field', '@getAlertSetting'))
  it('Alert Time', () => cy.sortBy('Alert Time', '@getAlertSetting'))
  it('Team', () => cy.sortBy('Team', '@getAlertSetting'))
})

describe('[ Setup Alert Setting ] Index', () => {
  beforeEach( () => {
    cy.visit('setup/alert/setting')
    cy.intercept('GET', '**/setting/alert*').as('getSetting')
    cy.intercept('DELETE', '**/bulk-delete/alert').as('bulkDeleteSetting')

    cy.wait('@getSetting')
    cy.get('.table-responsive table').as('SettingTable')
  })

  it('Check Alert Setting Table', () => {
    cy.get('@SettingTable').find('tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Check Action Table', () => {
    cy.get('@SettingTable').within(() => {
      cy.get('[data-cy=viewTable]').should('be.visible')
      cy.get('[data-cy=editTable]').should('be.visible')
      cy.get('[data-cy=deleteTable]').should('be.visible')
    })
  })

  it('Search Alert Setting Data', () => {
    cy.get('#kt_filter_search').type('a', {force: true})
    cy.wait('@getSetting').its('response.statusCode').should('eq', 200)
  })

  it('Pagination Alert Setting', () => {
    cy.get('@SettingTable').find('tbody > tr').should('have.length.greaterThan', 0)
    cy.get('.page-item.next > .page-link').click({force:true})
  })

  it('Bulk Delete Alert Setting', () => {
    cy.get('@SettingTable').find('tbody > tr').should('have.length.greaterThan', 0)

    cy.get('[data-cy=checkbokBulk]').first().click({ force:true })
    cy.wait(3000)
    cy.get('[data-cy=checkbokBulk]').last().click({ force:true })

    cy.wait(3000)
    cy.get('[data-cy=bulkDeleteSetting]').click({ force:true })
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    cy.wait(3000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Detail Alert Setting', () => {
    cy.get('@SettingTable').find('tbody > tr').should('have.length.greaterThan', 0)

    cy.get('[data-cy=viewTable]').last().click({ force:true })
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    cy.wait(3000)
    cy.get('.modal').click({force: true})
  })

  it('Export PDF Alert Setting', () => {
    cy.get('@SettingTable').find('tbody > tr').should('have.length.greaterThan', 0)

    cy.get('[data-cy=actionSetting]').click({ force:true })
    cy.get('[data-cy=exportToPDF]', {delayMs: 5000}).click({ force: true })
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    cy.wait(3000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Export Excel Alert Setting', () => {
    cy.get('@SettingTable').find('tbody > tr').should('have.length.greaterThan', 0)

    cy.get('[data-cy=actionSetting]').click({ force:true })
    cy.get('[data-cy=exportToExcel]', {delayMs: 5000}).click({ force: true })
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    cy.wait(3000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })
})
