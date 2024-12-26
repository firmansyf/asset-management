/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.superUser)

describe('[ Inventory ] Index', () => {
  beforeEach(() => {
    cy.visit('inventory')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    cy.intercept('GET', '**/inventory*').as('getInventory')
  })

  it('Data Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInventory').its('response.statusCode').should('eq', 200)
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Search Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInventory').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('#kt_filter_search').type('Inventory V2', {force: true})
    cy.get('.table-responsive table').within(() => {
      cy.get('tbody').find('tr.align-middle').should('contain', 'Inventory V2')
    })
  })

  it('Sort Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInventory').its('response.statusCode').should('eq', 200)
    cy.get('.fw-bolder > :nth-child(3)').click({force:true})
  })

  it('Pagination Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInventory').its('response.statusCode').should('eq', 200)
    cy.get('.page-item.next > .page-link').click({force:true})
  })

  it('Export PDF Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInventory').its('response.statusCode').should('eq', 200)

    cy.get('#dropdown-basic').click({force: true})
    cy.get('[data-cy=exportToPDF]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.wait(3000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Export Excel Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInventory').its('response.statusCode').should('eq', 200)

    cy.get('#dropdown-basic').click({force: true})
    cy.get('[data-cy=exportToExcel]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.wait(3000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Setup Column Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInventory').its('response.statusCode').should('eq', 200)

    cy.get('#dropdown-basic').click({force: true})
    cy.get('.dropdown-menu > :nth-child(1)').click({force: true})

    cy.wait(5000)
    cy.get('#column-0').click({force:true})

    cy.wait(2000)
    cy.get('#column-0').click({force:true})

    cy.wait(2000)
    cy.contains('Manage Columns').should('exist')
    cy.get('.card-footer > .btn-primary').click({force:true})
  })

  it('Detail Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getInventory').its('response.statusCode').should('eq', 200)
    cy.get('[data-cy=viewTable]:first').click({force:true})
  })
})

describe('[ Inventory ] Add', () => {
  beforeEach(() => {
    cy.visit('inventory/add')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    cy.intercept('POST', '**/inventory').as('addInventory')
  })

  it('Add Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get("input[name=description]").type("Descr Testing Account : "  + moment().format('HHmmss'), {force:true})
    cy.get("input[name=inventory_name]").type("Testing Account : "  + moment().format('HHmmss'), {force:true})
    // cy.get("select[name=category]").select("ee73165e-d1c7-4e6b-93bf-d5bf3ad5687c", {force:true})
    cy.contains('Enter Inventory Category').click({ force: true })
    cy.contains('Car').click({ force: true })
    
    // cy.get("select[name=currency_price_add_stock]").select("MYR", {force:true})
    cy.get("input[name=price_add_stock]").type("1000", {force:true})
    // cy.get("select[name=currency_price_remove_stock]").select("MYR", {force:true})
    cy.get("input[name=price_remove_stock]").type("500", {force:true})
    // cy.get("select[name=supplier]").select("1337d47f-1394-4ca4-8b16-07d26b74b477", {force:true})
    cy.contains('Enter Supplier').click({ force: true })
    cy.contains('Japan Ind').click({ force: true })
    
    cy.get("input[name=product_model]").type("ABC"  + moment().format('HHmmss'), {force:true})
    cy.get("input[name=initial_stock_qty]").type(moment().format('mmss'), {force:true})
    // cy.get("select[name=location]").select("e0870a9e-ad99-402e-ae6f-9d82ba834825", {force:true})
    cy.contains('Enter Location').click({ force: true })
    cy.contains('Jongol').click({ force: true })
    cy.get("input[name=low_stock_threshold]").type(moment().format('mmss'), {force:true})
    cy.get("input[name=inventory_identification_number]").type(moment().format('mmss'), {force:true})

    cy.fixture('images/profile.png').then( fileContent => {
      cy.get('input[type=file]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'images/profile.png',
        encoding: 'utf-8',
        mimeType: 'image/png'
      })
    })
    cy.get('.card-footer > .btn-primary').click({force:true})
    // cy.wait('@addInventory').its('response.statusCode').should('be.oneOf', [200, 201])
  })

  it('FE-2202 Country Format', () => {
    cy.get('#currency_price_add_stock').type('{downarrow}', {force: true})
    cy.get('#react-select-2-option-0').should('contains', /-/gi)
  })

  it('FE-2201 | remove checkbox on add/edit', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get("input[name=is_barcode]").should('not.exist')
    cy.get("input[name=is_serial_number]").should('not.exist')
    cy.get("input[name=is_unique_idno]").should('not.exist')
  })

  it('Add Inventory ( Check Notif Mandatory )', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get(1000)
    cy.get('.card-footer > .btn-primary').click({force:true})

    cy.wait(1000)
    cy.contains('Inventory Name is required').should('exist')
    cy.contains('Inventory Category is required').should('exist')
    cy.contains('Location is required').should('exist')
    cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
  })
})

describe('[ Inventory ] Update', () => {
  beforeEach(() => {
    cy.visit('inventory')
    cy.intercept('GET', '**/inventory*').as('getInventory')
    cy.intercept('GET', '**/inventory/**').as('getInventoryDetail')
    cy.intercept('PUT', '**/inventory/**').as('updateInventory')
    cy.wait('@getInventory')
    cy.get('[data-cy="editTable"]').click({force: true})
  })

  it('Update Inventory', () => {
    cy.wait('@getInventoryDetail')
    cy.get('input[name=inventory_name]').clear({force: true})
    cy.get("input[name=inventory_name]").type("Testing Account : "  + moment().format('HHmmss'), {force:true})
    cy.get('#select-category').type('{downarrow}', {force: true}).closest('[class$="-container"]').find('[id*="-option-"]:last').click({force: true})
    cy.get('#select-location').type('{downarrow}', {force: true}).closest('[class$="-container"]').find('[id*="-option-"]:last').click({force: true})
    // cy.get("input[name=description]").type("Descr Testing Account : "  + moment().format('HHmmss'), {force:true})
    // cy.get("select[name=currency_price_add_stock]").select("MYR", {force:true})
    // cy.get("input[name=price_add_stock]").type("1000", {force:true})
    // cy.get("select[name=currency_price_remove_stock]").select("MYR", {force:true})
    // cy.get("input[name=price_remove_stock]").type("500", {force:true})
    // cy.get("select[name=supplier]").select("1337d47f-1394-4ca4-8b16-07d26b74b477", {force:true})
    // cy.get("input[name=product_model]").type("ABC"  + moment().format('HHmmss'), {force:true})
    // cy.get("input[name=initial_stock_qty]").type(moment().format('mmss'), {force:true})
    // cy.get("input[name=low_stock_threshold]").type(moment().format('mmss'), {force:true})
    // cy.get("input[name=inventory_identification_number]").type(moment().format('mmss'), {force:true})
    // cy.get("input[name=is_barcode]").check({force:true})
    // cy.get("input[name=is_serial_number]").check({force:true})
    // cy.get("input[name=is_unique_idno]").check({force:true})

    cy.fixture('images/profile.png').then( fileContent => {
      cy.get('input[type=file]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'images/profile.png',
        encoding: 'utf-8',
        mimeType: 'image/png'
      })
    })
    cy.get('.card-footer > .btn-primary').click({force:true})
    cy.wait('@updateInventory').its('response.statusCode').should('be.oneOf', [200, 201])
  })
})

describe('[ Inventory ] Delete', () => {
  beforeEach(() => {
    cy.visit('inventory')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    cy.intercept('GET', '**/inventory*').as('getInventory')
    cy.intercept('DELETE', '**/inventory/**').as('deleteInventory')
  })

  it('Delete Inventory', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('[data-cy=deleteTable]:first').click({force:true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

    cy.wait(3000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
    cy.wait('@deleteInventory').its('response.statusCode').should('be.oneOf', [200, 201])
  })
})

describe('Inventory Filter Function', () => {
  beforeEach(() => {
    cy.visit('inventory')
    cy.intercept('**/inventory*', {fixture: 'inventorys'}).as('getInventory')
    cy.wait('@getInventory').its('response.statusCode').should('eq', 200)
  })

  it('Filter Inventory ID', () => cy.filterBy('Inventory ID', '@getInventory'))
  it('Filter Name', () => cy.filterBy('Name', '@getInventory'))
  it('Filter Category', () => cy.filterBy('Category', '@getInventory'))
  it('Filter Description', () => cy.filterBy('Description', '@getInventory'))
  it('Filter Total Quantity', () => cy.filterBy('Total Quantity', '@getInventory'))
  it('Filter Location', () => cy.filterBy('Location', '@getInventory'))
  it('Filter Supplier', () => cy.filterBy('Supplier', '@getInventory'))
  it('Filter Created On', () => cy.filterBy('Created On', '@getInventory'))
  it('Filter Inventory Identification Number', () => cy.filterBy('Inventory Identification Number', '@getInventory'))
  it('Filter Low Stock Threshold', () => cy.filterBy('Low Stock Threshold', '@getInventory'))
  it('Filter Created By', () => cy.filterBy('Created By', '@getInventory'))
  it('Filter Product Model Number', () => cy.filterBy('Product Model Number', '@getInventory'))
  it('Filter Price', () => cy.filterBy('Price', '@getInventory'))
})

describe('[ Add Inventory ] Loading Spinner Add Inventory', () => {
  beforeEach(() => {
    cy.visit('inventory')
    cy.intercept('**/api/**').as('api')
  })

  it('Loading Spinner Add Inventory', () => {
    cy.wait('@api')
    cy.get('[data-cy=addInventory]').click({force:true})

    cy.wait(3000)
    if( !cy.contains('Please wait...').should('not.exist') ) {
      cy.contains('Please wait...').should('exist')
    }
  })
})

describe('Case By Tickets', () => {
  it('FE-2237 issue on error message non mandatory field', () => {
    cy.visit('inventory/add')
    cy.intercept('POST', '**/inventory').as('addInventory')
    cy.intercept('GET', '**/inventory*').as('getInventory')
    let inventory_name = 'Inventory Test 001'
    cy.get('input[name="inventory_name"]').type(inventory_name, {force: true})
    cy.get('input[name="product_model"]').type('123', {force: true})
    cy.get('#select-category').type('{downarrow}', {force: true}).closest('[class$="-container"]').find('[id*="-option-"]:last').click({force: true})
    cy.get('#select-location').type('{downarrow}', {force: true}).closest('[class$="-container"]').find('[id*="-option-"]:last').click({force: true})
    cy.get('#select-supplier').type('{downarrow}', {force: true}).closest('[class$="-container"]').find('[id*="-option-"]:last').click({force: true})
  })
})
