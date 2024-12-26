beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('Report Pending Claim', () => {
    it('Report Pending Claim', () => {
        cy.visit('insurance-claims/report-pending-claim')
    })
})