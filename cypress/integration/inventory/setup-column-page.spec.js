beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('[ Inventory ] Setup Columns Page', () => {
    it('Setup Columns Page', () => {
        cy.visit('inventory')
        // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/inventory*').as('fetchInventory')
        // cy.wait('@fetchInventory').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('#dropdown-basic').click({force: true})
        cy.get('[data-cy=setupColumn]').click({force: true})
    })
})