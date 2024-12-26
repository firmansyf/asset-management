/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)
describe('[EMPLOYEE] Employee Page, Testing..', () => {
  beforeEach(() => {
    cy.visit('user-management/employee')
    cy.intercept('GET', '**/employee*').as('getEmployee')
  })

  it('Search Employee', () => {
    cy.get('input[data-cy=employee_search]').type('test', {force: true})
    cy.wait('@getEmployee').its('response.statusCode').should('eq', 200)
  })

  it('Filter Employee', () => cy.filterBy('Employee ID', '@getEmployee'))

  it('Sort Employee by Name', () => {
    cy.get('[data-cy=sort]').contains('Name').click({force: true})
    cy.wait('@getEmployee').its('response.statusCode').should('eq', 200)
  })

  it('Pagination-employee', () => {
    cy.get('.page-link').contains("2").click({force: true})
    cy.wait('@getEmployee').its('response.statusCode').should('eq', 200)
  })
})

describe('[EMPLOYEE] Actions Button, Testing..', () => {
  beforeEach(() => {
    cy.visit('user-management/employee')
    cy.intercept('GET', '**/employee*').as('getEmployee')
  })

  it('Action Button Export To PDF', () => {
    cy.get('[data-cy=actions]').click({force: true})
    cy.get('[data-cy=exportToPDF]').click({force: true})
    cy.get('.modal.show').find('button[type*="submit"]').click({force: true})
  })

  it('Action Button Export To Excel', () => {
    cy.get('[data-cy=actions]').click({force: true})
    cy.get('[data-cy=exportToExcel]').click({force: true})
    cy.get('.modal.show').find('button[type*="submit"]').click({force: true})
  })

  it('Action Button Import New Employee', () => {
    cy.get('[data-cy=actions]').click({force: true})
    cy.get('[data-cy=importNewEmployee]').click({force: true})
  })

  it('Setup Column Employee', () => {
    cy.get('[data-cy=actions]').click({force: true})
    cy.get('[data-cy=setupcolumns]').click({force: true})
    cy.get('span.btn.btn-sm.btn-primary').contains('Save Setup').click()
    cy.url().should('contain', 'user-management/employee')
  })
})


describe('[EMPLOYEE] Employee Crud, Testing..', () => {
  beforeEach( () => {
    cy.visit('user-management/employee')
    cy.intercept('GET', '**/employee*').as('getEmployee')
    cy.intercept('POST', '**/employee').as('addEmployee')
    cy.intercept('PUT', '**/employee/**').as('editEmployee')
    cy.intercept('DELETE', '**/employee/**').as('deleteEmployee')
    cy.intercept('POST', `**/bulk-delete/employee`).as('bulkDeleteEmployee')
  })

  it('Add-employee', () => {
    cy.get('[data-cy=addEmployee]').click({force: true})
    cy.get('input[name*="full_name"]').type('Test', {force:true})
    cy.get('input[name*="employee_id"]').type('0005', {force:true})
    cy.get('input[name*="job_title"]').type('Haiyuu', {force:true})
    cy.get('input[name*="email"]').type('tes@assetdata.io', {force:true})
    cy.get('select.form-select.form-select-solid[name*="location"]').select('Malaka')
    cy.get('select.form-select.form-select-solid[name*="company"]').select('')
    cy.get('select.form-select.form-select-solid[name*="department"]').select('')
    cy.get('button.btn-primary > span.indicator-label').click({force: true})
    cy.wait('@addEmployee').its('response.statusCode').should('be.oneOf', [200, 201, 422])
  })

  it('Add-employee ( Check Notif Mandatory )', () => {
    cy.wait(5000)
    cy.get('[data-cy=addEmployee]').click({force: true})
    cy.wait(1000)
    cy.get('button.btn-primary > span.indicator-label').click({force: true})
    cy.wait(1000)
    cy.contains('Full Name is required').should('exist')
    cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
  })

  it('FE-2215 | Custom Field - Unable to left cf blank', () => {
    cy.get('[data-cy=addEmployee]').click({force: true})
    cy.wait(3000)
    cy.get('input[name*="full_name"]').type('Employee 001', {force:true})
    cy.get('[data-cy*="date-field-value"]').type(moment().format('YYYY-MM-DD'), {force: true}).clear({force: true})
    cy.get('.modal.show').find('button[type="submit"]').click({force: true})
    cy.wait('@addEmployee').its('response.statusCode').should('be.oneOf', [200, 201, 422])
  })

  it('Edit-employee', () => {
    cy.get('.table-responsive table').within(() => {
      cy.get('[data-cy=editTable]:first').click({force: true})
    })
    cy.get('input[name=full_name]').clear().type('Yusuf Test', {force : true})
    cy.get('input[name=employee_id]').clear().type('2021-2022', {force : true})
    cy.get('input[name=job_title]').clear().type('there', {force : true})
    cy.get('input[name=email]').clear().type('there@assetdata.io', {force:true})
    cy.get('select.form-select.form-select-solid[name*="location"]').select('Tasikmalaya')
    cy.get('select.form-select.form-select-solid[name*="company"]').select('')
    cy.get('select.form-select.form-select-solid[name*="department"]').select('')
    cy.get('button.btn-primary > span.indicator-label').click({force: true})
    cy.wait('@editEmployee').its('response.statusCode').should('be.oneOf', [200, 201, 422])
  })

  it('Detail-employee', () => {
   cy.get('[data-cy=viewTable]:first').click({force: true})
    cy.get('.modal').should('have.class', 'show')
  })

  it('Delete-employee', () => {
    cy.get('[data-cy=deleteTable]:first').click({force: true})
    cy.get('.modal.show').find('button[type*="submit"]').click({force: true})
    cy.wait('@deleteEmployee').its('response.statusCode').should('be.oneOf', [200, 201])
  })

  it('Bulk Delete Employee', () => {
    cy.get('input[data-cy=checkbokBulk]').first().check({force: true})
    cy.get('button[data-cy=bulkDelete]').click({force: true})
    cy.get('.modal.show').find('button[type*="submit"]').click({force: true})
    cy.wait('@bulkDeleteEmployee').its('response.statusCode').should('be.oneOf', [200, 201])

  })
})
