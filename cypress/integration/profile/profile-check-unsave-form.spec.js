
beforeEach(cy.login)
describe('[PROFILE] Check Warning for unsaved changes', () => {
    beforeEach( () => {
      cy.visit('profile')
      cy.wait(15000)
    })
  
    it('Check Check Warning for unsaved changes', () => {
        cy.get('input[name*="first_name"]').click({force: true}).clear({force:true}).type('UpdateProfile', {force:true}).blur()
        cy.get('[data-cy="addAsset"]').click({force:true})
        cy.get('[data-cy="unsaveWarning"]').should('contain', 'This page contains unsaved changes')
    })
})