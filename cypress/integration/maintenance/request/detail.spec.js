beforeEach(cy.login)
describe('Request Detail', () => {
  beforeEach(() => {
    cy.visit('maintenance/request')
    cy.intercept('GET', '**/maintenance/request*').as('getRequest')
    cy.intercept('GET', '**/maintenance/request/**').as('getRequestDetail')
    cy.wait('@getRequest')
    cy.get('[data-cy="viewTable"]').first().click({force: true})
  })
  it('FE-2260 - Standardize Screen Detail', () => {
    cy.wait('@getRequestDetail')
    cy.get('[data-cy="card-title"]').should('contain', 'Request Information')
    cy.get('[data-cy="detail-container"] div:first div').should('have.class', 'bg-gray-100')
  })
})
