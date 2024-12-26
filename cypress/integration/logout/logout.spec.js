beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('Logout', () => {
    it('Logout', () => {
        cy.visit('logout')
    })
})