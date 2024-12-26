/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Maintenance Work Order', () => {
  it('Add Maintenance Work Order Check Maintenance Category', () => {
    cy.visit('maintenance/work-orders/add')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
    cy.wait(2000)
    cy.contains('Maintenance Category').should('exist')
  })
  
  it('Edit Maintenance Work Order Check Maintenance Category', () => {
    cy.visit('maintenance/work-orders/edit?id=7955a94f-b76d-434d-bf58-22bea0142317')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
    cy.wait(2000)
    cy.contains('Maintenance Category').should('exist')
  })

  it('Detail Maintenance Work Order Check Maintenance Category', () => {
    cy.visit('maintenance/work-orders/detail/7955a94f-b76d-434d-bf58-22bea0142317')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
    cy.wait(2000)
    cy.contains('Maintenance Category').should('exist')
  })
})