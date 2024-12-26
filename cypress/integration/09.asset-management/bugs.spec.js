beforeEach(cy.login)
describe('Asset Detail', () => {
  beforeEach(() => {
    cy.visit('asset-management/all')
    cy.intercept('**/report/asset*').as('getAsset')
    cy.intercept('**/asset/**').as('getAssetDetail')
  })
  it('FE-2245 - Currency issue', () => {
    cy.wait('@getAsset')
    // cy.wait('@getAssetDetail')
    cy.get('[data-cy="editTable"]:first').click({force: true})
    cy.get('input[placeholder="Enter price"]').clear({force: true}).type(100, {force: true})
    cy.get('button[type="submit"]:first').click({force: true})
    cy.wait('@getAssetDetail')
    cy.get('[data-cy="price-value"]').should('contain', '100')
  })
  it('FE-2271 - issue if table show more than 10 data on all module', () => {
    cy.wait('@getAsset')
    cy.get('.card-table-header').should('have.css', 'position', 'sticky').and('have.css', 'top')
  })
})
