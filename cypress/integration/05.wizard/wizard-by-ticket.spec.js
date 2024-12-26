describe('Case by Tickets', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
        cy.intercept('GET', '**/a/me').as('me')
        cy.intercept('GET', '**/api/**').as('api')
    })
    it('SEN-124 Cannot convert undefined or null to object', () => {
        cy.wait('@api').its('response.statusCode').should('eq', 200)
    })
    it('SEN-114 Cannot read properties of undefined (reading 0)', () => {
        cy.wait('@me').its('response.statusCode').should('eq', 200)
    })
})