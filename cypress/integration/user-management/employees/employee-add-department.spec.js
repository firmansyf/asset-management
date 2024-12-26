/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)
const date=Date.now()

describe('[EMPLOYEE] Add Department', () => {
    beforeEach( () => {
        cy.visit('user-management/employee')
        cy.wait(10000)
    })
    it('Check Add New Department Button', () => {
        cy.get('[data-cy=addEmployee]').click({force: true})
        cy.wait(6000)
        cy.get('[data-cy=addDepartment]').should('exist')
    })
    it('Check Add New Department', () => {
        cy.get('[data-cy=addEmployee]').click({force: true})
        cy.wait(6000)
        cy.get('[data-cy=addDepartment]').click({force: true})
        cy.get('input[name*="name"]').eq(1).type(`Department ${date}`)
        cy.get('select.form-select.form-select-solid[name*="company_guid"]').select('abc')
    })
})
  