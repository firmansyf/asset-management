/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Setup Model', () => {
  beforeEach( () => {
    cy.visit('setup/settings/model')
    cy.intercept('GET', '**/setting/manufacturer/model/filter*').as('getModel')
    cy.get('.table-responsive table').as('modelTable')
  })

  it('Check Model Table', () => {
    cy.get('@modelTable').find('tbody > tr').should('have.length.greaterThan', 0)
  })
  it('Check Action Table', () => {
    cy.get('@modelTable').find('[data-cy=viewTable]').should('be.visible')
    cy.get('@modelTable').find('[data-cy=editTable]').should('be.visible')
    cy.get('@modelTable').find('[data-cy=deleteTable]').should('be.visible')
  })
  it('Search Model Data', () => {
    cy.get('#kt_filter_search').type('a', {force: true})
    cy.wait('@getModel').its('response.statusCode').should('eq', 200)
  })
  it('Update Filter', () => {
    cy.filterBy('Model', '@getModel')
    cy.get('[data-cy=editTable]:first').click({force: true})
    cy.get('.modal.show').find('input[name="name"]').clear({force: true}).type('Edited', {force: true})
    cy.get('.modal.show').find('button[type="submit"]').click({force: true})
    // cy.wait('@getModel')
    // cy.get('[data-cy="filterChild"]').eq(0).click({force: true})
    // cy.get('.dropdown-menu.show').find('input[type="checkbox"]:checked').eq(0).next('label').should('contain', 'Edited')
  })
})

describe('Setup > Settings > Model', () => {
  beforeEach(() => {
    cy.visit('setup/settings/model')
    cy.intercept('GET', '**/setting/manufacturer/model/filter*').as('getModel')
    cy.intercept('GET', '**/setting/manufacturer/model/filter*?page=1&limit=25*').as('getModelAllData')
    cy.get('.table-responsive > .table').as('ModelTable')
  })

  it('Check Search Model', () => {
    cy.get('input[data-cy=search]').type('Model 1', {force: true})
    cy.intercept('GET', '**/setting/manufacturer/model/filter/*').as('fetchModelSearch')
    // cy.wait('@fetchModelSearch').its('response.statusCode').should('be.oneOf', [200, 201])
    cy.get('.table-responsive > .table').as('ModelTableSearch')
    cy.get('@ModelTableSearch').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Model 11')
    })
    cy.get('input[data-cy=search]').clear()
  })

  it('Check filter Model by Model', () => {
    cy.get('[data-cy=filter] button', ).click({force: true})
    cy.get('input#column-0').check().should('has.value', 'name')
    cy.get('[data-cy=filterButton0').should('contain', 'Model')
    cy.get('[data-cy="filterChild"]').eq(0).click({force: true})
    cy.get('#name-3').click({force: true, multiple: true})
    cy.get('[data-cy="filterChild"]').eq(0).click({force: true})
    cy.get('#name-4').click({force: true, multiple: true})
    cy.intercept(
      'GET',
      `**/setting/manufacturer/model/filter?page=1&limit=10&keyword=**&orderCol=name&orderDir=asc&filter[name]=Model 10,Model 11`
    ).as('fetchModelFilter')
    cy.get('.table-responsive > .table').as('ModelTableFilter')
    cy.get('@ModelTableFilter').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Model 11')
    })
  })

  it('Check Sort Model by Manufacturer', () => {
    cy.get('[data-cy=sort]').click({force: true, multiple: true})
    cy.intercept('GET',`**/setting/manufacturer/model/filter*`)
    // cy.get('.table-responsive table').find('tbody > tr > td').not('.sticky-cus').should('contain', 'Manufacture123')
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

  it('Check Detail Model', () => {
    cy.wait('@getModel').then(() => {
      cy.get("[data-cy=viewTable]").first().click({force: true})
    })
  })

  it('Check Add Model', () => {
    // check error message if Model filed is empty
    cy.get('.flex-wrap > :nth-child(2) > :nth-child(1) > .btn').should('contain', 'Add New Model').click({force: true})
    cy.get('div.modal').find('div.modal-header').should('contain', 'Add New Model')
    // cy.get('select.form-select.form-select-solid[name*="manufacturer_guid"]').select('Select Manufacturer').blur({force: true})
    cy.get('.modal-body > div.mb-3')
    // cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'This manufacturer is required')
    cy.get('input[name=name]').clear({force: true}).blur({force: true})
    cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'This model name is required')

    // check input Model
    cy.get('.flex-wrap > :nth-child(2) > :nth-child(1) > .btn').should('contain', 'Add New Model').click({force: true})
    cy.get('div.modal').find('div.modal-header').should('contain', 'Add New Model')
    // cy.get('select.form-select.form-select-solid[name*="manufacturer_guid"]').select(0).blur({force: true})
    cy.get('.modal-body > div.mb-3')
    cy.get('input[name=name]').type(`Test Model`, {force: true})
    cy.get('.modal-footer > .btn-primary').contains('Add').click({force: true}).end()
    cy.intercept('POST', '**/setting/manufacturer/model*').as('addModel')
    // cy.wait('@addModel').its('response.statusCode').should('be.oneOf', [200, 201])
  })

  it('Check Update Model', () => {
    cy.get('@ModelTable')
    .find(':nth-child(1) > .text-center > .d-flex > [data-cy=editTable]').click({force: true})
    // check modal
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.get('div.modal').find('div.modal-header').should('contain', 'Edit Model')
    // edit data form
    // cy.get('select.form-select.form-select-solid[name*="manufacturer_guid"]').select(0).blur({force: true})
    cy.get('.modal-body > div.mb-3')
    cy.get('input[name=name]').clear({force: true}).type(`Edit Model Name`, {force: true})
    cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true}).end()
    cy.intercept('PUT', '**/setting/manufacturer/model/*').as('editModel')
    // cy.wait('@editModel').its('response.statusCode').should('be.oneOf', [200, 201])
  })

  it('Check Delete Model', () => {
    cy.get('@ModelTable')
    .find('tbody > tr.align-middle').filter(':contains("MOdel 2")').first()
    .find('[data-cy=deleteTable]:first').click({force: true})
    cy.get('[role=dialog]').should('have.class', 'fade modal show')
    cy.get(':nth-child(1) > .text-center > .d-flex > [data-cy=deleteTable]').click({force : true})
    cy.intercept('DELETE', '**/setting/manufacturer/model/*').as('deleteModel')
    // cy.wait('@deleteModel').its('response.statusCode').should('be.oneOf', [200, 201])
  })

  it('Check Delete Bulk Model', () => {
    cy.get('@ModelTable')
    .find('tbody > tr.align-middle').filter(':contains("Model 1")')
    .find('td.sticky-cus > div.form-check > input[data-cy=checkbokBulk]').check({force: true, multiple: true })
    cy.get('button[data-cy=btnBulkDelete]').should('contain', "Delete Selected").and('be.visible')
    cy.get('button[data-cy=btnBulkDelete]').click({force: true})
    cy.intercept('POST', '**/bulk-delete/manufacturer-model*').as('deleteBulkModel')
    // cy.wait('@deleteBulkModel').its('response.statusCode').should('be.oneOf', [200, 201])
  })

  it('Change Number Data Per Page', () => {
    cy.get('select[name="number_of_page"]').select('25', {force: true})
    cy.wait('@getModelAllData').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('table > tbody > tr').should('have.length.greaterThan', 10)
  })

  it.skip('Pagination Page 2', () => {
    cy.wait('@getModel').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get(':nth-child(3) > .page-link').should('contain', '2').click({force: true})
    cy.intercept('GET', '**/setting/manufacturer/model/filter/?page=1*').as('getModelPage2')
    // cy.wait('@getModelPage2').its('response.statusCode').should('be.oneOf', [200, 304])
  })
})

describe('[MODELS] Add Manufacturer', () => {
  beforeEach( () => {
    cy.visit('setup/settings/model')
    cy.wait(6000)
  })

  it('Check Add New Manufacturer Button', () => {
    cy.get('[data-cy=addModel]').click({force: true})
    cy.wait(6000)
    cy.get('[data-cy=addManufacturer]').should('be.visible')
  })

  it('Check Add New Manufacturer', () => {
    cy.get('[data-cy=addModel ]').click({force: true})
    cy.wait(6000)
    cy.get('[data-cy=addManufacturer]').click({force: true})
    cy.get('input[name*="name"]').eq(1).type(`Manufacturer`, {force: true})
    cy.get('input[name*="description"]').type(`Description`, {force: true})
  })
})
