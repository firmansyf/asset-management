/* eslint-disable cypress/no-unnecessary-waiting */

beforeEach(cy.login)
describe('[PROFILE] Add Depertment', () => {
    beforeEach( () => {
      cy.visit('profile')
      cy.wait(6000)
    })
  
    it('Check Add New Depertment', () => {
        cy.get('[data-cy=addDepertment]').click({force: true})
        cy.get('input[name="name"]').eq(0).type(`NewDepartment`, {force: true})
    })
})
