/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Maintenance Work Order', () => {
  it('Detail Maintenance Link WO', () => {
    cy.visit('maintenance/work-orders/detail/7955a94f-b76d-434d-bf58-22bea0142317')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
    cy.wait(2000)
    cy.contains('Link Ticket').should('exist')
    cy.get('#linkWo').should('exist')
    cy.get('#linkWo').type('{downarrow}', {force: true}).tab()
    cy.get('[data-cy=submitLink]').click({force: true})
  })
})