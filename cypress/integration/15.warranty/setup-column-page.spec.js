beforeEach(cy.login)
describe('[ Warranty ] Setup Columns Page', () => {
  it('Setup Columns Page', () => {
    cy.visit('warranty')
    cy.intercept('GET', '/media/**').as('fetchMedia')
    cy.intercept('GET', '**/warranty*').as('fetchWarranty')
    cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('#dropdown-basic').click({force: true})
    cy.get('.dropdown-menu > :nth-child(4)').click({force: true})
    cy.contains('Manage Columns').should('exist')
  })
})
  