beforeEach(cy.login)

describe('All Insurance Claim', () => {
    it('All Insurance Claim Data', () => {
        cy.visit('insurance-claims/all')
    })
})