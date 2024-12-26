export function filterBy(label, alias){
  // cy.wait(alias)
  cy.get('[data-cy="filterAll"]').click({force: true})
  if( !cy.contains(label).should('not.exist') ) {
    cy.get('.dropdown-item').contains(label).closest('div').find('input[type="checkbox"]').check({force: true})
    cy.wait(alias)
    cy.get('.dropdown-toggle').contains(label).closest('button').click({force: true})
    cy.get('.dropdown-menu.show').find('.dropdown-item:first input[type="checkbox"]').click({force: true})
    // cy.wait(alias).its('response.statusCode').should('eq', 200)
  }
}
export function filterByIndex(index, alias){
  // cy.wait(alias)
  cy.get('[data-cy="filterAll"]').click({force: true})
  if( !cy.get('.dropdown-item').should('not.exist') ) {
    cy.get('.dropdown-item').eq(index).closest('div').find('input[type="checkbox"]').check({force: true})
    cy.wait(alias)
    cy.get('[data-cy="filterChild"]').eq(0).click({force: true})
    cy.get('.dropdown-menu.show').find('.dropdown-item:first input[type="checkbox"]').click({force: true})
    // cy.wait(alias).its('response.statusCode').should('eq', 200)
  }
}
