/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)
describe('Check Work Order Process Log', () => {
    beforeEach( () => {
        cy.visit('maintenance/work-order')
        cy.intercept('GET', '**/maintenance*').as('fetchWorkOrder')
        cy.wait(5000)
        cy.get('.table-responsive table').as('WorkOrderTable')
    })

    it('Check is flag work order process log', () => {
        cy.get('[data-cy=viewTable]').first().click({force:true})
        cy.wait(5000)
        cy.get('[data-cy=btnProcessLog]').should('exist')
        cy.get('[data-cy=btnProcessLog]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.contains('Process Flow').should('exist')
        cy.contains('Created Work Order').should('exist')
    })

    it('Check order process log', () => {
        cy.get('[data-cy=viewTable]').first().click({force:true})
        cy.wait(5000)
        cy.get('[data-cy=btnProcessLog]').should('exist')
        cy.get('[data-cy=btnProcessLog]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.contains('Process Flow').should('exist')
        cy.contains('Newest First').should('exist')
        cy.get('[data-cy=btnSortProcessLog]').should('exist')
        cy.get('[data-cy=btnSortProcessLog]').click({force: true})
        cy.wait(2000)
        cy.contains('Oldest First').should('exist')
        cy.get('[data-cy=btnSortProcessLog]').click({force: true})
        cy.wait(2000)
        cy.contains('Newest First').should('exist')
    })
})