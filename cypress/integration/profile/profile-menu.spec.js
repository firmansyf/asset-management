beforeEach(cy.login)
describe('Profile Page, Testing..', () => {
    beforeEach( () => {
        cy.visit('profile')
    })

    it('Check Profile Dropdown Menu', () => {
        cy.get('.cursor-pointer > img').click({force: true}).should('be.visible')
        cy.get('a.menu-link.px-5').should('contain', 'My Profile')
        cy.get('span.menu-link.px-5').should('contain', 'Sign Out')
    })

    it('Check My Profile Menu', () => {
        cy.get('.cursor-pointer > img').click({force: true}).should('be.visible')
        cy.get('a.menu-link.px-5').should('contain', 'My Profile')
    })

    it('Check Sign Out Menu', () => {
        cy.get('.cursor-pointer > img').click({force: true}).should('be.visible')
        cy.get('span.menu-link.px-5').should('contain', 'Sign Out')
    })    

})
