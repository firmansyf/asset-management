/* eslint-disable cypress/no-unnecessary-waiting */
// import moment from 'moment'

// const date = Date.now()
beforeEach(cy.login)

describe('Warranty', () => {
    beforeEach( () => {
        cy.visit('/warranty')
        cy.intercept('GET', '**/warranty*').as('getWarranty')
        cy.intercept('POST', '**/warranty').as('addWarranty')
        // cy.intercept('POST', '**/warranty').as('addWarranty')
        cy.intercept('PUT', '**/warranty/*').as('updateWarranty')
        cy.intercept('DELETE', '**/warranty/*').as('deleteWarranty')
        cy.intercept('POST', '**/bulk-delete/warranty').as('bulkDeleteWarranty')
        cy.intercept('GET', '**/setting/database/*').as('databaseWarranty')

        cy.wait("@getWarranty")
        // cy.wait("@databaseWarranty")
        cy.get('.table-responsive > .table').as('WarrantyTable')
    })

    it('Check Table Warranty', () => {
        cy.title().should('contain', 'Warranty')
        cy.get('#kt_toolbar_container').should('contain', 'Warranty')
        cy.get('.fs-6 > :nth-child(6)').should('contain', 'Status')
        cy.get('.fs-6 > :nth-child(3)').should('contain', 'Asset ID')
        cy.get('.fs-6 > :nth-child(4)').should('contain', 'Asset Name')
        cy.get('@WarrantyTable').find('[data-cy=editTable]:first').should('be.visible')
        cy.get('@WarrantyTable').find('[data-cy=deleteTable]:first').should('be.visible')
    })

    it('Check Search Warranty', () => {
        cy.get('input[data-cy=WarrantySearch]').type('Asset', {force: true})
        cy.intercept('GET', '**/warranty/*').as('fetchWarrantySearch')
        // cy.wait('@fetchWarrantySearch').its('response.statusCode').should('be.oneOf', [200, 201])
        cy.get('.table-responsive > .table').as('WarrantyTableSearch')
        cy.get('@WarrantyTableSearch').within(() => {
            cy.get('tbody').find('tr.align-middle').should('contain', '01')
        })
        cy.get('input[data-cy=WarrantySearch]').clear()
    })

    it('Check filter Warranty by Warranty Asset-ID', () => {
        cy.get('[data-cy=filter] button', ).click({force: true})
        cy.intercept('GET',`**/warranty?page=1&limit=10&keyword=**&orderDir=desc&orderCol=asset_id&filter[asset_id]=SSB03115`, {statusCode: 200})
        cy.get('input#column-0').check().should('has.value', 'asset_id')
        // cy.get('[data-cy=filterChild] button').click({force: true})
        // cy.get('input#asset_id-0').check().should('has.value', 'ABC00001')
    })

    it('Check Sort Warranty by Asset ID', () => {
        cy.get('[data-cy=sort]').find('.d-flex').contains('Asset ID').click({force: true})
        cy.intercept('GET',`**/warranty/*`, {statusCode: 200})
        cy.get('.table-responsive table').find('tbody > tr > td').not('.sticky-cus').should('contain', 'account')
    })

    //new
    it('Pagination Warranty', () => {
        // cy.wait('@getWarranty').its('response.statusCode').should('eq', 200)
        // cy.get('.page-item.next > .page-link').click({force:true})
    })

    //fix
    it('Check Export PDF Warranty', () => {
        cy.wait('@getWarranty').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=actionWarranty]').click({ force:true })
        cy.get('[data-cy=exportToPDF]', {delayMs: 5000}).click({ force: true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    //new
    it('Check Export Excel Warranty', () => {
        cy.wait('@getWarranty').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=actionWarranty]').click({ force:true })
        cy.get('[data-cy=exportToExcel]', {delayMs: 5000}).click({ force: true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    //new
    it('Import New Warranty', () => {
        cy.wait('@getWarranty').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=actionWarranty]').click({ force:true })
        cy.get('[data-cy=importWarranty]', {delayMs: 5000}).click({ force: true })
    })

    //fix
    it('Check Add Warranty', () => {
        cy.get('@getWarranty').wait(5000)
        cy.get('[data-cy=addWarranty]').click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.wait(3000)
        cy.get('form').within( () => {
            // check error message if warranty filed is empty
            cy.get('.asset_guid_cypress')
            .click({force:true})
            .find('input#assetGuid')
            .type('00{enter}', {force: true})

            cy.get('input[name*="description"]').type(`Test Description`, {force: true})
            cy.get('input[name="expired"]').click({force: true})
            // cy.get('[data-value="15"]').click({force: true})
            cy.get('input[name="length"]').type(`6`, {force: true})

            cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true}).end()
            // cy.wait('@addWarranty') //.its('response.statusCode').should('be.oneOf', [200, 201])
        })
    })

    //fix
    it('Check Update Warranty', () => {
        cy.get('[data-cy=editTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.wait(3000)
        cy.get('form').within( () => {
            // check error message if warranty filed is empty
            cy.wait(3000)
            cy.get('.asset_guid_cypress')
            .click({force:true})
            .find('input#assetGuid')
            .type('00{enter}', {force: true})
            cy.get('input[name*="description"]').type(`Test Description`, {force: true})
            cy.get('input[name="expired"]').click({force: true})
            // cy.get('[data-value="15"]').click({force: true})
            cy.get('input[name="length"]').type(`6`, {force: true})

            cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true}).end()
            // cy.wait('@updateWarranty') //.its('response.statusCode').should('be.oneOf', [200, 201])
        })
    })

    //new
    it('Check Detail Warranty', () => {
        cy.wait('@getWarranty').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=viewTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.btn-secondary').click({force: true})
    })

    //new
    it('Check Asset Detail Warranty', () => {
        cy.wait('@getWarranty').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=viewTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force: true})
    })

    //fix
    it('Check Delete Warranty', () => {
        cy.get('[data-cy=deleteTable]').last().click({force: true})
        cy.get('[role=dialog]').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click()
        cy.wait('@deleteWarranty').its('response.statusCode').should('be.oneOf', [200, 201])
    })

    // fix
    it('Check Delete Bulk Warranty', () => {
        cy.get('@WarrantyTable').find('tbody > tr').should('have.length.greaterThan', 0)

        cy.get('[data-cy=checkbokBulk]').first().click({ force:true })
        cy.wait(3000)
        cy.get('[data-cy=checkbokBulk]').last().click({ force:true })

        cy.wait(3000)
        cy.get('[data-cy=btnBulkDelete]').click({force: true})
        cy.get('[role=dialog]').should('have.class', 'fade modal show')

        cy.get('.modal-footer > .btn-primary').click({ force:true })
        cy.wait('@bulkDeleteWarranty').its('response.statusCode').should('be.oneOf', [200, 201])
    })
})

describe('Case by tickets', () => {
  beforeEach( () => {
    cy.visit('/warranty')
    cy.intercept('GET', '**/warranty*').as('getWarranty')
    // cy.wait("@getWarranty")
  })
  it('FE-1598 Loading on process show table', () => {
    cy.get('.react-loading-skeleton').should('be.visible')
  })
})
