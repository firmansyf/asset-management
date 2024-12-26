/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('[ Trash ] Brand', () => {
  beforeEach(() => {
    cy.visit('trash/brand')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    cy.intercept('GET', '**/trash/manufacturer-brand*').as('getTrashBrand')
    cy.intercept('PUT', '**/trash/manufacturer-brand/**').as('restoreTrashBrand')
    cy.intercept('DELETE', '**/trash/manufacturer-brand/**').as('deleteTrashBrand')
  })

  it('View Trash Brand', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getTrashBrand').its('response.statusCode').should('be.oneOf', [200, 304])
    
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Restore Trash Brand', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getTrashBrand').its('response.statusCode').should('be.oneOf', [200, 304])
    
    cy.get('[data-cy=restoreTable]').first().click({force: true})
    cy.wait(5000)
    cy.get('.modal-footer > .btn-primary').click({force: true})
    cy.wait('@restoreTrashBrand').its('response.statusCode').should('be.oneOf', [200, 201])
    cy.wait('@getTrashBrand')
  })

  it('Delete Trash Brand', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getTrashBrand').its('response.statusCode').should('be.oneOf', [200, 304])
    
    cy.get('[data-cy=deleteTable]').first().click({force: true})
    cy.wait(5000)
    cy.get('.modal-footer > .btn-primary').click({force: true})
    cy.wait('@deleteTrashBrand').its('response.statusCode').should('be.oneOf', [200, 201])
    cy.wait('@getTrashBrand')
  })
})
