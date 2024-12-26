/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Setup Type', () => {
  beforeEach( () => {
    cy.visit('setup/settings/type')
    cy.intercept('GET', '**/setting/type/filter*', {fixture: 'setup/settings/types/get'}).as('getType')
    cy.wait('@getType')
    cy.get('.table-responsive table').as('dataTable')
  })
  it('Table', () => {
    cy.get('@dataTable').find('tbody > tr').should('have.length.greaterThan', 0)
    cy.get('@dataTable').find('tbody > tr:first > td').as('row')
    cy.get('@row').find('[data-cy=viewTable]').should('be.visible')
    cy.get('@row').find('[data-cy=editTable]').should('be.visible')
    cy.get('@row').find('[data-cy=deleteTable]').should('be.visible')
  })
  it('Search', () => {
    cy.get('[data-cy="search"]').type('a', {force: true})
    cy.wait('@getType').its('response.statusCode').should('eq', 200)
  })
})
describe('Filter', () => {
  beforeEach( () => {
    cy.visit('setup/settings/type')
    cy.intercept('GET', '**/setting/type/filter*', {fixture: 'setup/settings/types/get'}).as('getType')
    cy.wait('@getType')
    cy.get('.table-responsive table').as('dataTable')
  })
  it('Type', () => cy.filterBy('Type', '@getType'))
  it('Category', () => cy.filterBy('Category', '@getType'))
})
describe('Sort', () => {
  beforeEach( () => {
    cy.visit('setup/settings/type')
    cy.intercept('GET', '**/setting/type/filter*', {fixture: 'setup/settings/types/get'}).as('getType')
    cy.wait('@getType')
    cy.get('.table-responsive table').as('dataTable')
  })
  it('Type', () => cy.sortBy('Type', '@getType'))
  it('Category', () => cy.sortBy('Category', '@getType'))
})
describe('CRUD', () => {
  beforeEach( () => {
    cy.visit('setup/settings/type')
    cy.intercept('GET', '**/setting/type/filter*', {fixture: 'setup/settings/types/get'}).as('getType')
    cy.intercept('POST', '**/setting/type', {fixture: 'setup/settings/types/add'}).as('addType')
    cy.intercept('PUT', '**/setting/type/*', {fixture: 'setup/settings/types/edit'}).as('editType')
    cy.intercept('DELETE', '**/setting/type/*', {fixture: 'setup/settings/types/delete'}).as('deleteType')
    cy.intercept('POST', '**/bulk-delete/type', {fixture: 'setup/settings/types/bulkDelete'}).as('bulkDeleteType')
    cy.wait('@getType')
    cy.get('.table-responsive table').as('dataTable')
  })
  function addEditForm(){
    cy.get('.modal.show').as('modal')
    cy.get('@modal').find('select[name="category"]').find('option').then(opt => {
      if (opt.length > 1) {
        cy.get('@modal').find('select[name="category"]').select(1, {force: true})
      }
    })
    cy.get('@modal').find('input[name="name"]').clear({force: true}).type('ABC', {force: true})
    cy.get('@modal').find('button[type="submit"]').click({force: true})
  }
  it('View', () => {
    cy.get('@dataTable').find('[data-cy=viewTable]:first').click({force: true})
    cy.get('.modal').should('have.class', 'show')
  })
  it('Add', () => {
    cy.get('button').contains('Add New Type').click({force: true})
    addEditForm()
    cy.wait(['@addType', '@getType'])
  })
  it('Edit', () => {
    cy.get('@dataTable').find('[data-cy=editTable]:first').click({force: true})
    addEditForm()
    cy.wait(['@editType', '@getType'])
  })
  it('Delete', () => {
    cy.get('@dataTable').find('[data-cy=deleteTable]:first').click({force: true})
    cy.get('.modal.show').find('button[type="submit"]').click({force: true})
    cy.wait(['@deleteType', '@getType'])
  })
  it('Bulk Delete', () => {
    cy.get('@dataTable').find('tbody > tr:first > td').find('[data-cy="checkbokBulk"]').check({force: true})
    cy.get('button').contains('Delete Selected').click({force: true})
    cy.get('.modal.show').find('button[type="submit"]').click({force: true})
    cy.wait(['@bulkDeleteType', '@getType'])
  })
})

describe('[TYPES] Add Category', () => {
  beforeEach( () => {
    cy.visit('setup/settings/type')
    cy.wait(6000)
  })

  it('Check Add New Category Button', () => {
    cy.get('[data-cy=addType]').click({force: true})
    cy.wait(6000)
    cy.get('[data-cy=addCategory]').should('be.visible')
  })

  it('Check Add New Category', () => {
    cy.get('[data-cy=addType ]').click({force: true})
    cy.wait(6000)
    cy.get('[data-cy=addCategory]').click({force: true})
    cy.get('input[name*="category"]').eq(1).type(`Category`, {force: true})
  })
})