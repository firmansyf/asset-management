/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Inventory', () => {
  beforeEach( () => {
    cy.visit('inventory/detail/7584d27d-a903-472a-9683-db6f8ddb400b#reservation')
    cy.intercept('**/api/**',).as('getInventory')
  })
  it('Add Reservation', () => {
    cy.wait('@getInventory')
    cy.get('[data-cy=moreMenu]').click({force: true})
    cy.get('.dropdown-menu.show').should('be.visible');
    cy.get('[data-cy=btnReservation]').should('be.visible');
    cy.get('[data-cy=btnReservation]').click({force: true, multiple:true})
    cy.get('#locationReservation').type('{downarrow}', {force: true}).tab()
  })
})