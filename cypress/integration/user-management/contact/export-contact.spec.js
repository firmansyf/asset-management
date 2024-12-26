beforeEach(cy.login)
describe('Contact Page, Export Testing...', () => {
    beforeEach(() => {
        cy.visit('user-management/contact')
        cy.intercept('**/api/**').as('getData')
        cy.wait('@getData')
    })

    it('Export PDF', () => {
        cy.get('[data-cy=actions]').click({force : true})
        cy.get('[data-cy=exportToPDF]').click({force : true})
        cy.get('.modal-footer > .btn-primary').click({force : true})
        // cy.intercept('post', '**/api/**').as('export')
    })

    it('Export Excel', () => {
        cy.get('[data-cy=actions]').click({force : true})
        cy.get('[data-cy=exportToExcel]').click({force : true})
        cy.get('.modal-footer > .btn-primary').click({force : true})
        // cy.intercept('post', '**/api/**').as('export')
    })
})