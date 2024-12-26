/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Detail Inventory', () => {
  beforeEach( () => {
    cy.visit('inventory/detail/d533bcd9-c8bb-45fc-9d78-5f11dbe453cc#reservation')
    cy.intercept('**/api/**').as('getInventory')
  })

  it('Check Calendar Reservation Section', () => {
    cy.wait('@getInventory')
    cy.wait(3000)
    cy.get('.fc-event-main').should('be.visible');
  })

  it('Check Calendar Reservation Popup', () => {
    cy.wait('@getInventory')
    cy.wait(3000)
    cy.get('[data-cy=moreMenu]').click({force: true})
    cy.get('.dropdown-menu.show').should('be.visible');
    cy.get('[data-cy=btnReservation]').should('be.visible');
    cy.get('[data-cy=btnReservation]').click({force: true, multiple:true})
  })
})