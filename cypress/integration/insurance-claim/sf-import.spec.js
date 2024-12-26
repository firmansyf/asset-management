beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('SF Import', () => {
    it('SF Import', () => {
        cy.visit('insurance-claims/sf-history')
    })

    it('Export SF Import', () => {
        cy.visit('insurance-claims/sf-history')
    })

    it('Setup SF Import', () => {
        cy.visit('insurance-claims/sf-history')
    })
})