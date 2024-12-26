/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Maintenace Request', () => {
  it('Add Maintenance Request Check Maintenance Category', () => {
    cy.visit('maintenance/add-request')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
    cy.wait(2000)
    cy.contains('Maintenance Category').should('exist')
  })
  
  it('Edit Maintenance Request Check Maintenance Category', () => {
    cy.visit('maintenance/add-request?id=5fe99932-6bc0-4ba8-8971-3d645a43f2f0')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
    cy.wait(2000)
    cy.contains('Maintenance Category').should('exist')
  })

  it('Detail Maintenance Request Check Maintenance Category', () => {
    cy.visit('maintenance/request-detail/5fe99932-6bc0-4ba8-8971-3d645a43f2f0')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
    cy.wait(2000)
    cy.contains('Maintenance Category').should('exist')
  })
})