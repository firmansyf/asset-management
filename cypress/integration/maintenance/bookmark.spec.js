/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Maintenance', () => {
  beforeEach( () => {
    cy.visit('maintenance/work-orders/detail/7955a94f-b76d-434d-bf58-22bea0142317')
    cy.intercept('GET', '**/api/**').as('getData')
  })

  it('Bookmark Maintenance', () => {
    cy.wait('@getData')
    cy.get('[data-cy=bookmarkTicket]').should('be.visible')
  })
})