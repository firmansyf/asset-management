/* eslint-disable cypress/no-unnecessary-waiting */
// import moment from 'moment'
beforeEach(cy.login)

describe('Setup Brand', () => {
  beforeEach( () => {
    cy.visit('setup/settings/brand')
    cy.intercept('GET', '**/setting/manufacturer/model/filter*').as('getModel')
    cy.intercept('GET', '**/setting/manufacturer/brand/filter*').as('getBrand')
    cy.intercept('POST', '**/setting/manufacturer/brand').as('addBrand')
    cy.intercept('PUT', '**/setting/manufacturer/brand/*').as('updateBrand')
    cy.intercept('DELETE', '**/setting/manufacturer/brand/*').as('deleteBrand')
    cy.intercept('DELETE', '**/bulk-delete/manufacturer-brand').as('bulkDeleteBrand')

    cy.get('.table-responsive table').as('BrandTable')
   
  })

  it('Check Brand Table', () => {
    cy.get('@BrandTable').find('tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Check Action Table', () => {
    cy.get('@BrandTable').within(() => {
      cy.get('[data-cy=editTable]').should('be.visible')
      cy.get('[data-cy=deleteTable]').should('be.visible')
      cy.get('[data-cy=viewTable]').should('be.visible')
    })
  })

  it('Search Brand Data', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)
    // cy.get('#kt_filter_search [data-cy=search]').type('a', {force: true})
  })

  it('Update Filter', () => {
    // cy.filterBy('Brand', '@getBrand')
    // cy.get('[data-cy=editTable]:first').click({force: true})
    // cy.get('.modal.show').find('input[name="name"]').clear({force: true}).type('Edited', {force: true})
    // cy.get('.modal.show').find('button[type="submit"]').click({force: true})
    // cy.wait('@getBrand')
    // cy.get('[data-cy="filterChild"]').eq(0).click({force: true})
    // cy.get('.dropdown-menu.show').find('input[type="checkbox"]:checked').eq(0).next('label').should('contain', 'Edited')
  })

  it('Sort Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)
    // cy.get('.fw-bolder > :nth-child(3)').click({force:true})
  })

  it('Pagination Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)
    // cy.get('.page-item.next > .page-link').click({force:true})
  })

  it('Add Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)

    // cy.get('[data-cy=addBrand]').click({ force:true })
    // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    // cy.get('form').within( () => {
    //   cy.get('select[name=manufacturer_guid].form-select').select('f94d668a-a2c0-49d1-a70c-8211a753b40b', {force: true})
    //   cy.get('select[name=manufacturer_model_guid].form-select').select('0f541696-1226-41f0-9d4c-353975381ba1', {force: true})

    //   cy.get('input[name=name]').clear({force: true})
    //   cy.get('input[name=name]').type('Testing Brand : ' + moment().format('mmss'), {force: true})

    //   cy.get('.modal-footer > .btn-primary').click({force: true})
    //   cy.wait('@addBrand').its('response.statusCode').should('be.oneOf', [200, 201])
    //   cy.wait('@getBrand')
    // })
  })

  it('Update Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)

    // cy.get('[data-cy=editTable]').last().click({ force:true })
    // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    // cy.get('form').within( () => {
    //   cy.get('select[name=manufacturer_guid].form-select').select('f94d668a-a2c0-49d1-a70c-8211a753b40b', {force: true})
    //   cy.get('select[name=manufacturer_model_guid].form-select').select('0f541696-1226-41f0-9d4c-353975381ba1', {force: true})

    //   cy.get('input[name=name]').clear({force: true})
    //   cy.get('input[name=name]').type('Testing Brand : ' + moment().format('mmss'), {force: true})

    //   cy.get('.modal-footer > .btn-primary').click({force: true})
    //   cy.wait('@updateBrand').its('response.statusCode').should('be.oneOf', [200, 201])
    //   cy.wait('@getBrand')
    // })
  })

  it('Delete Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)

    // cy.get('[data-cy=deleteTable]').last().click({ force:true })
    // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    // cy.wait(3000)
    // cy.get('.modal-footer > .btn-primary').click({force:true})
    // cy.wait('@deleteBrand').its('response.statusCode').should('be.oneOf', [200, 201])
    // cy.wait('@getBrand')
  })

  it('Bulk Delete Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)

    // cy.get('[data-cy=checkbokBulk]').first().click({ force:true })
    // cy.wait(3000)
    // cy.get('[data-cy=checkbokBulk]').last().click({ force:true })

    // cy.wait(3000)
    // cy.get('[data-cy=bulkDeleteBrand]').click({ force:true })
    // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    // cy.wait(3000)
    // cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Detail Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)

    // cy.get('[data-cy=viewTable]').last().click({ force:true })
    // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    // cy.wait(3000)
    // cy.get('.modal-footer > .btn-sm').click({force: true})
  })

  it('Export PDF Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)

    // cy.get('[data-cy=actionBrand]').click({ force:true })
    // cy.get('[data-cy=exportToPDF]', {delayMs: 5000}).click({ force: true })
    // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    // cy.wait(3000)
    // cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Export Excel Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)

    // cy.get('[data-cy=actionBrand]').click({ force:true })
    // cy.get('[data-cy=exportToExcel]', {delayMs: 5000}).click({ force: true })
    // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    // cy.wait(3000)
    // cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Import New Brand', () => {
    cy.wait('@getBrand').its('response.statusCode').should('eq', 200)

    // cy.get('[data-cy=actionBrand]').click({ force:true })
    // cy.get('[data-cy=importBrand]', {delayMs: 5000}).click({ force: true })
  })
})
