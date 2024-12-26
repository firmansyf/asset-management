describe('Case By Tickets', () => {
  beforeEach(() => {
    cy.visit('dashboard')
    cy.intercept('**/api/v1/widget*').as('getWidget')
  })
  it('FE-2259 [DASHBOARD] Typo on Feeds', () => {
    cy.wait('@getWidget')
    cy.get('#feedsOption').select('audit-status', {force: true})
    cy.get('div').contains('Choose Period').should('exist')
  })
})
  