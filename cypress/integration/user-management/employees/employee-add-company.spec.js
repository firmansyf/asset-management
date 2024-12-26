/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)
const date=Date.now()

describe('[EMPLOYEE] Add Company', () => {
    beforeEach( () => {
        cy.visit('user-management/employee')
        cy.wait(6000)
    })
    it('Check Add New Company Button', () => {
        cy.get('[data-cy=addEmployee]').click({force: true})
        cy.wait(6000)
        cy.get('[data-cy=addCompany]').should('be.visible')
    })
    it('Check Add New Company', () => {
        cy.get('[data-cy=addEmployee]').click({force: true})
        cy.wait(6000)
        cy.get('[data-cy=addCompany]').click({force: true})
        cy.get('input[name*="name"]').eq(1).type(`Company ${date}`)
        cy.get('input[name*="address_1"]').type(`Address1`, {force:true})
        cy.get('input[name*="street"]').type(`Address2`, {force:true})
        cy.get('input[name*="city"]').type(`City`, {force:true})
        cy.get('input[name*="state"]').type(`State`, {force:true})
        cy.get('input[name*="postcode"]').type(`12345`, {force:true})
        cy.get('select.form-select.form-select-solid[name*="country_code"]').select('Aruba')
    })
})
  