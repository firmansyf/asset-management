beforeEach(cy.login)
const date=Date.now()

describe('[EMPLOYEE] Add Location', () => {
    beforeEach( () => {
      cy.visit('user-management/employee')
      cy.wait(6000)
    })
    it('Check Add New Location Button', () => {
        cy.get('[data-cy=addEmployee]').click({force: true})
        cy.wait(6000)
        cy.get('[data-cy=addLocation]').should('be.visible')
    })
    it('Check Add New Location', () => {
        cy.get('[data-cy=addEmployee]').click({force: true})
        cy.wait(6000)
        cy.get('[data-cy=addLocation]').click({force: true})
        cy.get('input[name*="location"]').eq(1).type(`Location ${date}`, {force:true})
        cy.get('select.form-select.form-select-sm.form-select-solid[name*="location_status"]').select('Available')
    })
})
  