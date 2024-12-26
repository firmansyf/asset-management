beforeEach(cy.login)

describe('Trash', () => {
  beforeEach(() => {
    cy.visit('trash')
    cy.intercept('**/api/**').as('getTrash')
  })

  it('List Trash', () => {
    cy.wait('@getTrash')
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Font Table Trash', () => {
    cy.wait('@getTrash')
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Date Table Trash Preference', () => {
    cy.wait('@getTrash')
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    // cy.get('tbody > tr > td:nth-child(4) > div').should('contain', '05-19-2022 20:04')
  })

  it('Filter Trash', () => {
    cy.wait('@getTrash')
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy=btnFilterTrash]').click({force: true})
    cy.get('#asset.form-check-input').check({force: true})
    cy.wait('@getTrash')
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.contains('asset deui').should('exist')
  })

  it('Search Trash', () => {
    cy.wait('@getTrash')
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.get('[data-cy=Search]').type('asset', {force: true})
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    cy.contains('asset deui').should('exist')
  })
})
