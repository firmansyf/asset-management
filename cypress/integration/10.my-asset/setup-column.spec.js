beforeEach(cy.login)

describe('Setup Column My Aseet', () => {
    it('Check List Column', () => {
        cy.visit('asset-management/add')
    })

    it('Update Column', () => {
        cy.visit('asset-management/add')
    })
})