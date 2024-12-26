/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)
describe('Check Work Order Flag', () => {
    beforeEach( () => {
        cy.visit('maintenance/work-order')
        cy.intercept('GET', '**/maintenance*').as('fetchWorkOrder')
        cy.wait('@fetchWorkOrder').its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table').as('WorkOrderTable')
    })

    it('Check is flag work order', () => {
        cy.get('[data-cy=viewTable]').first().click({force:true})
        cy.wait(5000)
        cy.get('[data-cy=flagWorkOrder]').click({force: true})
        cy.get('[data-cy=flagWorkOrder] > .fas').should('be.visible')
    })

    it('Check is unflag work order', () => {
        cy.get('[data-cy=viewTable]').first().click({force:true})
        cy.wait(5000)
        cy.get('[data-cy=flagWorkOrder]').click({force: true})
        cy.get('[data-cy=flagWorkOrder] > .far').should('be.visible')
    })
})