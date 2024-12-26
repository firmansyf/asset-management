export function sortBy(label, alias){
  // cy.wait(alias)
  cy.get('[data-cy="sort"]').contains(label).click({force: true})
  cy.wait(alias).its('response.statusCode').should('eq', 200)
}
export function sortByIndex(index, alias){
  // cy.wait(alias)
  cy.get('[data-cy="sort"]').eq(index).click({force: true})
  cy.wait(alias).its('response.statusCode').should('eq', 200)
}
