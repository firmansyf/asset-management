beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('Report Asset Status', () => {
    it('Report Asset Status', () => {
        cy.visit('reports/asset-status')
        // cy.get('input[name="description"]').type('Address', {force: true})
    })
})