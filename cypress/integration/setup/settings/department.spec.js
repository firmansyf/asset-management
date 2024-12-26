/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Setup Department', () => {
  beforeEach(() => {
    cy.visit('setup/settings/department')
    cy.intercept('GET', '**/setting/company').as('getCompany')
    cy.intercept('GET', '**/setting/department/filter*').as('getDepartment')
    cy.intercept('GET', '**/setting/department/filter*?page=1&limit=25*').as('getDepartmentAllData')
    cy.intercept('POST', '**/setting/department').as('addDepartment')
    cy.intercept('PUT', '**/setting/department/*').as('editDepartment')
    cy.intercept('DELETE', '**/setting/department/*').as('deleteDepartment')

    cy.wait('@getDepartment')
    cy.wait('@getCompany')
    cy.get('.table-responsive > .table').as('DepartmentTable')
  })

  it('Check API', () => {
    cy.wait('@getDepartment').its('response.statusCode').should('eq', 200)
  })

  // it('Update Filter', () => {
  //   cy.filterBy('Department', '@getDepartment')
  //   cy.get('[data-cy=editTable]:first').click({force: true})
  //   cy.get('.modal.show').find('input[name="name"]').clear({force: true}).type('Edited', {force: true})
  //   cy.get('.modal.show').find('button[type="submit"]').click({force: true})
  //   cy.wait('@getDepartment')
  //   cy.get('[data-cy="filterChild"]').eq(0).click({force: true})
  //   cy.get('.dropdown-menu.show').find('input[type="checkbox"]:checked').eq(0).next('label').should('contain', 'Edited')
  // })

  it('Check Table Department', () => {
    cy.title().should('contain', 'Departments')
    cy.get('#kt_toolbar_container').should('contain', 'Departments')
    cy.get('@DepartmentTable').find('thead > tr > th.sticky-cus').find('i').should('have.class', 'las')
    cy.get('.fs-6 > :nth-child(3)').should('contain', 'Department')
    cy.get('.fs-6 > :nth-child(4)').should('contain', 'Company Name')
    cy.get('@DepartmentTable').find('[data-cy=editTable]').should('be.visible')
    cy.get('@DepartmentTable').find('[data-cy=deleteTable]').should('be.visible')
  })

  it('Check Search Department', () => {
    cy.get('input[data-cy=Search]').type('Dep New', {force: true})
    cy.intercept('GET', '**/setting/department/filter/*').as('fetchDepartmentSearch')
    // cy.wait('@fetchDepartmentSearch').its('response.statusCode').should('be.oneOf', [200, 201])
    cy.get('.table-responsive > .table').as('DepartmentTableSearch')
    cy.get('@DepartmentTableSearch').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Dep New')
    })
    cy.get('input[data-cy=Search]').clear()
  })

  it('Check filter Department by Department', () => {
    cy.get('[data-cy=filter] button', ).click({force: true})
    cy.get('input#column-0').check().should('has.value', 'name')
    cy.get('[data-cy=filterButton0').should('contain', 'Department')
    cy.get('[data-cy="filterChild"]').eq(0).click({force: true})
    cy.get('#name-0').click({force: true, multiple: true})
    cy.get('[data-cy="filterChild"]').eq(0).click({force: true})
    cy.get('#name-1').click({force: true, multiple: true})
    cy.intercept('GET',`**/setting/department/filter?page=1&limit=10&keyword=**&orderCol=name&orderDir=asc&filter[name]=Compax Dua,Compax Satu`).as('fetchDepartmentFilter')
    cy.get('.table-responsive > .table').as('DepartmentTableFilter')
    cy.get('@DepartmentTableFilter').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Compax')
    })
  })

  it('Check Sort Department by Company Name', () => {
    cy.get('[data-cy=sort]').find('.d-flex').contains('Company Name').click({force: true})
    cy.intercept('GET',`**/setting/department/filter*`)
    cy.get('.table-responsive table').find('tbody > tr > td').not('.sticky-cus').should('contain', 'Compass')
  })

  it('Check Export to PDF', () => {
    cy.get('[data-cy=actions] button', ).click({force: true})
    cy.get('.dropdown > .show.dropdown').find('[data-cy=exportToPDF]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
  })

  it('Check Export to Excel', () => {
    cy.get('[data-cy=actions] button', ).click({force: true})
    cy.get('.dropdown > .show.dropdown').find('[data-cy=exportToExcel]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
  })

  it('Check Detail Department', () => {
    cy.wait('@getDepartment').then(() => {
      cy.get("[data-cy=viewTable]").first().click({force: true})
    })
  })

  it('Check Add Department', () => {
    // check error message if Department filed is empty
    cy.get('[data-cy=addDepartment]').should('contain', 'Add New Department').click({force: true})
    cy.get('div.modal').find('div.modal-header').should('contain', 'Add New Department')
    cy.get('input[name*="name"]').clear({force: true}).blur({force: true})
    cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Department name is required')
    cy.get('select.form-select.form-select-solid[name*="company_guid"]').select('Select Company').blur({force: true})
    cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Company name is required')

    // check input Department
    cy.get('[data-cy=addDepartment]').should('contain', 'Add New Department').click({force: true})
    cy.get('div.modal').find('div.modal-header').should('contain', 'Add New Department')
    cy.get('input[name*="name"]').type(`HR Department`, {force: true})
    cy.get('select.form-select.form-select-solid[name*="company_guid"]')
    .select('e7ee9438-87d6-4c21-9ece-694adb56e5ba', { force: true })
    .invoke('val')
    .should('eq', 'e7ee9438-87d6-4c21-9ece-694adb56e5ba')
    cy.get('.modal-footer > .btn-primary').contains('Add').click({force: true}).end()
    cy.wait('@addDepartment')
  })

  it('Check Update Department', () => {
    cy.get('@DepartmentTable')
    .find('tbody > tr.align-middle').filter(':contains("dep 9")')
    .find('[data-cy=editTable]:first').click({force: true})
    // check modal
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.get('div.modal').find('div.modal-header').should('contain', 'Edit Department')
    // edit data form
    cy.get('input[name*="name"]').clear({force: true}).type(`Edit Department Name`, {force: true})
    cy.get('select.form-select.form-select-solid[name*="company_guid"]')
    .select('3ad390da-20ed-4aac-acec-963b62178f55', { force: true })
    .invoke('val')
    .should('eq', '3ad390da-20ed-4aac-acec-963b62178f55')

    cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true}).end()
    cy.wait('@editDepartment')
  })

  it('Check Delete Department', () => {
    cy.get('@DepartmentTable')
    .find('tbody > tr.align-middle').filter(':contains("dep 5")').first()
    .find('[data-cy=deleteTable]:first').click({force: true})
    cy.get('[role=dialog]').should('have.class', 'fade modal show')
    cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click()
    cy.wait('@deleteDepartment')
  })

  it('Check Delete Bulk Department', () => {
    cy.get('@DepartmentTable')
    .find('tbody > tr.align-middle').filter(':contains("dep")')
    .find('td.sticky-cus > div.form-check > input[data-cy=checkbokBulk]').check({force: true, multiple: true })
    cy.get('button[data-cy=btnBulkDelete]').should('contain', "Delete Selected").and('be.visible')
    cy.get('button[data-cy=btnBulkDelete]').click({force: true})
    cy.intercept('POST', '**/bulk-delete/department').as('deleteBulkDepartment')
    // cy.wait('@deleteBulkDepartment').its('response.statusCode').should('be.oneOf', [200, 201])
  })

  it('Change Number Data Per Page', () => {
    cy.get('select[name="number_of_page"]').select('25', {force: true})
    cy.wait('@getDepartmentAllData').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('table > tbody > tr').should('have.length.greaterThan', 10)
  })

  it('Pagination Page 2', () => {
    cy.wait('@getDepartment').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get(':nth-child(3) > .page-link').should('contain', '2').click({force: true})
    cy.intercept('GET', '**/setting/department/filter/?page=1*').as('getDepartmentPage2')
    // cy.wait('@getDepartmentPage2').its('response.statusCode').should('be.oneOf', [200, 304])
  })
})

describe('[DEPARTMENT] Add Company', () => {
  beforeEach( () => {
    cy.visit('setup/settings/department')
    cy.wait(6000)
  })
  it('Check Add New Company Button', () => {
      cy.get('[data-cy=addDepartment]').click({force: true})
      cy.wait(6000)
      cy.get('[data-cy=addCompany]').should('be.visible')
  })
  it('Check Add New Company', () => {
      cy.get('[data-cy=addDepartment]').click({force: true})
      cy.wait(6000)
      cy.get('[data-cy=addCompany]').click({force: true})
      cy.get('input[name*="name"]').eq(1).type(`Company`, {force: true})
      cy.get('input[name*="address_1"]').type(`Address1`, {force: true})
      cy.get('input[name*="street"]').type(`Address2`, {force: true})
      cy.get('input[name*="city"]').type(`City`, {force: true})
      cy.get('input[name*="state"]').type(`State`, {force: true})
      cy.get('input[name*="postcode"]').type(`12345`, {force: true})
      cy.get('select.form-select.form-select-solid[name*="country_code"]').select('Aruba')
  })
})
