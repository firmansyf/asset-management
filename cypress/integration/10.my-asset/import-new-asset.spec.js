beforeEach(cy.login)

describe('[ MY ASSETS ] Import New Assets', () => {
    it('Redirect Import New Assets', () => {
        cy.visit('my-assets')
        cy.intercept('GET', '/media/**').as('fetchMedia')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('#dropdown-basic').click()
        cy.get('.dropdown-menu > :nth-child(4)').click()
    })
})