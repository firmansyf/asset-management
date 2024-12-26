beforeEach(cy.login)
describe('Billing Edit Payment', () => {
    beforeEach(() => {
        cy.visit('/billing/confirm-form?change=detail&package=Professional%20Plan:%20IDR%20500000/monthly,%20500%20As&price=500000.00&totalAsset=500&PaymentCycle=monthly&uniqueId=professional_plan:_idr_500000/monthly,_500_assets')
        cy.intercept('**/api/**').as('api')
    })

    it('Edit Payment', () => {
        cy.wait('@api')
        // cy.get('.pageSubTitle').should('be.visible');
        cy.get('form').within(() => {
            cy.get(':nth-child(1) > .card-body > .row > :nth-child(1) > .form-control[name=first_name]').clear({force : true}).type('Check', {force : true})
            cy.get(':nth-child(1) > .card-body > .row > :nth-child(2) > .form-control[name=last_name]').clear({force : true}).type('Cypress', {force : true})
            cy.get(':nth-child(3) > .col > .css-b62m3t-container')
            cy.get(':nth-child(1) > .card-body > .row > :nth-child(4) > .form-control').clear({force : true}).type('testingaccount@mailinator.com', {force : true})
            cy.get(':nth-child(5) > .input-group > .form-control').clear({force : true}).type('883647722', {force : true})
            cy.get('.css-16r5znb-control > .css-1yjo0db-ValueContainer')
            cy.get(':nth-child(2) > .card-body > .row > :nth-child(2) > .form-control').clear({force : true}).type('State', {force : true})
            cy.get(':nth-child(3) > .form-control').clear({force : true}).type('Address', {force : true})
            cy.get(':nth-child(2) > .card-body > .row > :nth-child(4) > .form-control').clear({force : true}).type('Extend Address', {force : true})
            cy.get(':nth-child(5) > .form-control').clear({force : true}).type('Jakarta', {force : true})
            cy.get(':nth-child(6) > .form-control').clear({force : true}).type('40558', {force : true})
            cy.get('input[name="card_name"]').type('nomnom', {force : true})
            cy.get('.col-lg-7 > .input-group > .form-control').type('4242424242424242', {force : true})
            cy.get('.col-lg-5 > .row > :nth-child(1) > .input-group > .form-control').type('0530', {force: true})
            cy.get(':nth-child(2) > .input-group > .form-control').type('314', {force : true})
        })
        cy.get('[data-cy=saveBilling]').click({force : true})
        // cy.get('.indicator-progress').should('be.visible');
        cy.intercept('**/api/**').as('api')
    })
})