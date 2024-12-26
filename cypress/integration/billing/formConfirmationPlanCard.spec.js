/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)
describe('Billing, Confirm Your Plan Details. Testing...', () => {
    beforeEach(() => {
        cy.visit('/billing/billing-overview')
        cy.intercept('**/api/**').as('getBilling')
    })

    it('Card Detail...', () => {
        cy.wait('@getBilling')
        cy.get('[data-cy=editCardPayment]').click({force:true})
        cy.get('form').within(() => {
            // cy.get('.card-detail').within(() => {
            cy.get('[name=card_number]').type('4242424242424242', {force : true})
            cy.get('#security_code').type('314', {force : true})
            cy.get('#expired_date').type('0530', {force: true})
            cy.get('input[name="card_name"]').type('nomnom', {force : true})
            // })
        })
        cy.get('[data-cy=saveBilling]').click({force : true})
    })
})