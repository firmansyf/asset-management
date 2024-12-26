beforeEach(cy.login)
// example
describe('Case By Ticket BUG-135', () => {
    it('Data Table ( there is data ), Testing...', () => {
        // There is data - Warranty Page
        cy.intercept('GET', '**/api/**').as('warrantyGet')
        cy.visit('location/sub-location')
        cy.get('.table-responsive table').find('tbody > tr').should('have.length.greaterThan', 0)
        cy.wait('@warrantyGet').its('response.statusCode').should('eq', 200)
        // no data - 
        cy.reload()
    })

    it('Data Table ( no data ), Testing...', () => {
        cy.visit('warranty')
        cy.intercept('GET', '**/api/**').as('warrantyGet')
    })
})