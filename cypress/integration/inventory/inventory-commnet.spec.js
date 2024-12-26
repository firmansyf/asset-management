beforeEach(cy.login)
const date=Date.now()

describe('Detail Inventory Comments', () => {
  beforeEach( () => {
    cy.visit('inventory')
    cy.intercept('GET', '**/inventory/*').as('getInventoryDetail')
    cy.get('[data-cy="viewTable"]').first().click({force: true})
    cy.wait('@getInventoryDetail')
  })

  it('Check Create a Comment', () => {
    cy.get('[data-cy=inventoryCommnet]')
    .click({force: true})
    .type(`test commnet ${date}{enter}`, {force: true})

    cy.get('[data-cy=commentUser]').should('be.visible').and('contain', 'Regita Safira')
    cy.get('[data-cy=commentBody]').should('be.visible').and('contain', `test commnet ${date}`)
    cy.get('[data-cy=commentCreateAt]').should('be.visible')
  })
}) 