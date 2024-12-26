/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Hide Repeat Schedule Inventory', () => {
  it('Detail Inventory', () => {
    cy.visit('inventory/detail/d533bcd9-c8bb-45fc-9d78-5f11dbe453cc')
    cy.intercept('**/api/**').as('getInventory')
    cy.wait('@getInventory')
    cy.contains('Repeat Schedule').should('not.exist')
  })

  it('Edit Inventory', () => {
    cy.visit('inventory/add?id=d533bcd9-c8bb-45fc-9d78-5f11dbe453cc')
    cy.intercept('**/api/**').as('getInventory')
    cy.wait('@getInventory')
    cy.contains('Repeat Schedule').should('not.exist')
  })

  it('Add Inventory', () => {
    cy.visit('inventory/add')
    cy.intercept('**/api/**').as('getInventory')
    cy.wait('@getInventory')
    cy.contains('Repeat Schedule').should('not.exist')
  })

  it('List Inventory', () => {
    cy.visit('inventory')
    cy.intercept('**/api/**').as('getInventory')
    cy.wait('@getInventory')
    cy.contains('Repeat Schedule').should('not.exist')
  })
})