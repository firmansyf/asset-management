beforeEach(cy.login)

describe('Location Wrong Page', () => {
  beforeEach( () => {
    cy.visit('locationt/location')
    cy.intercept('**/api/**').as('fecthAPI')
  })

  it('Direct /locationt/location', () => {
    cy.wait('@fecthAPI')
    cy.contains('Page Not Found').should('exist');
    cy.contains('Go to homepage').should('exist');
    cy.get('.btn-primary.fw-bolder.btn-lg').click({force: true});
    cy.wait('@fecthAPI')
    cy.contains('All Dashboard').should('exist');
  })
})
