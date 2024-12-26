beforeEach(cy.login)

describe('Approval', () => {
    it('Approval Insurance', () => {
        cy.visit('approval/insurance-claim')
    })

    it('Approval History', () => {
        cy.visit('approval/history')
    })
})
