beforeEach(() => cy.login)
describe('Asset Detail Check In', () => {
  beforeEach(() => {
    cy.visit('asset-management/detail/d421a731-0471-4f4f-bdd8-4d22b51163c8')
    cy.intercept('**/api/v1/**').as('getDetailAsset')
    cy.wait('@getDetailAsset')
    // cy.visit('asset-management/all')
    // cy.intercept('**/report/asset*', {fixture: 'asset-management/getAsset'}).as('getAsset')
    // cy.wait('@getAsset')
    // cy.get('[data-cy=viewTable]:first').click({force: true})
  })

  it('Check Box Checkout', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Asset Name')
    cy.get('.text-dark').should('contain', 'Procom Coupler')
  })

  it('Check button', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Asset Name')
    cy.get('.text-dark').should('contain', 'Procom Coupler')
  })

  it('Check history', () => {
    cy.get('.fw-bolder.text-dark').should('contain', 'Asset Name')
    cy.get('.text-dark').should('contain', 'Procom Coupler')
  })

})
  