beforeEach(cy.login)

describe('Setting Maintenance', () => {
  beforeEach(() => {
    cy.visit('setup/maintenance/maintenance-category')
    cy.intercept('**/api/**').as('api')
  })
  it('Check Hide Menu Vendors Maintenance', () => {
    cy.wait('@api')
    cy.get('.menu-title').contains('Vendors').should('not.exist');;
  })
})