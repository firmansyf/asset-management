beforeEach(cy.login)

describe('Billing, Testing...', () => {
    it('Billing Overview, Testing...', () => {
        cy.visit('billing/billing-overview')
        cy.intercept('GET', '**/api/**').as('getBilling')
        cy.get('.mt-2 > span').click({force : true})
        cy.go('back')
    })
})