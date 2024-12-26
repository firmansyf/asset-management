/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Detail Reservation Asset Page', () => {
  it('Add Reservation Page', () => {
    cy.visit('asset-management/detail/73635350-cb63-44bb-8840-9d39e28a32b6')
    cy.intercept('GET', '**/api/**').as('fetchAsset')
    cy.wait(3000)

    cy.contains('Details of asset ABC00004').should('exist')
    cy.contains('Reservation Schedule').should('exist')
    cy.contains('Reserved').should('exist')
    cy.get('[data-cy=btnViewReserve]').should('exist')
    cy.get('[data-cy=btnViewReserve]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.contains('Reserved Asset Detail').should('exist')
    // cy.get('div.fc-daygrid-event-harness > a > div > div > p').should('contains', 'dede')
  })
})