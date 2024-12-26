beforeEach(cy.login)
describe('Insurance Policy Detail', () => {
  beforeEach(() => {
    cy.visit('insurance/policies')
    cy.intercept('GET', '**/insurance/filter*').as('getInsurance')
    cy.intercept('GET', '**/insurance/**').as('getInsuranceDetail')
    cy.wait('@getInsurance')
    cy.get('[data-cy="viewTable"]').first().click({force: true})
  })
  it('FE-2260 - Standardize Screen Detail', () => {
    cy.wait('@getInsuranceDetail')
    cy.get('[data-cy="card-title"]').should('contain', 'Insurance Policy Information')
    cy.get('[data-cy="detail-container"] div:first div').should('have.class', 'bg-gray-100')
  })
})
