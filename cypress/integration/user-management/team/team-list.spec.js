beforeEach(cy.login)
describe('Team Page, Testing..', () => {
  beforeEach(() => {
    cy.visit('user-management/team')
    cy.intercept('GET', '**/api/**').as('getTeam')
  })

  it('Search Team', () => {
    cy.get('#kt_filter_search').type('test', {force: true})
    cy.wait('@getTeam').its('response.statusCode').should('eq', 200)
  })
})