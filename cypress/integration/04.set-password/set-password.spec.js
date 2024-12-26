
describe('Set Password Testing...', () => {
    it('set password', () => {
        cy.visit('set-password')
        cy.get('form').within(() => {
            cy.get('[data-test=password]').type('Test@123', {force: true})
            cy.get('[data-test=password_confirm]').type('Test@123', {force: true})
            cy.get('button[type=submit]').should('contain', 'Set Password').click({force: true})
        })
    })
})
