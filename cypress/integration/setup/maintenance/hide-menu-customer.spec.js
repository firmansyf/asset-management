beforeEach(cy.login)

describe('Setting Maintenance', () => {
  beforeEach(() => {
    cy.visit('setup/maintenance/maintenance-category')
    cy.intercept('**/api/**').as('api')
  })
  it('Check Hide Menu Customer Maintenance', () => {
    cy.wait('@api')
    cy.get('.menu-title').contains('Customer').should('not.exist');;
  })
})