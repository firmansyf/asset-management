beforeEach(cy.login)

describe('Insurance Claim', () => {
    it('Disable Edit Field for Import Date and Time', () => {
        cy.visit('insurance-claims/3b14718e-a7c7-4ade-b896-590351a18878/edit')
        cy.intercept('**/api/**').as('api')
        cy.wait('@api')
        cy.get('input[name="import_date_and_time"]').should('not.exist')
    })
})