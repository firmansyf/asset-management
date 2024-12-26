beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('Setup Feature', () => {
    it('Setup Feature', () => {
        cy.visit('setup/settings/asset-status')
    })

    it('Enabled Feature', () => {
        cy.visit('setup/settings/asset-status')
    })
})