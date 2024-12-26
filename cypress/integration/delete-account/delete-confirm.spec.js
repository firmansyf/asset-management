beforeEach(cy.login)
describe('Delete Account Confirm, Testing...', () => {
    it('Delete Account', () => {
        cy.visit('/delete-confirm')
        cy.get('.css-1s2u09g-control').click({force:true})
        cy.get('[data-cy=btnContinue]').click({force:true})
        cy.intercept('POST', `**/a/delete-confirm`).as('deleteAccount')
    })  
})