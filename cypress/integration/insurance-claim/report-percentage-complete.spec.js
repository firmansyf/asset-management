beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('Report Percentage Complete', () => {
    it('Report Percentage Complete', () => {
        cy.visit('insurance-claims/report-percentage')
    })
})