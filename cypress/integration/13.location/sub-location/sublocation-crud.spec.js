beforeEach(cy.login)

describe('Sub Location', () => {
    beforeEach( () => {
        cy.visit('/location/sub-location') 
        cy.intercept('GET', '**/api/**').as('getSubLocation')
        cy.wait('@getSubLocation')
        cy.get('.table-responsive > .table').as('SubLocationTable')
    })

    it('Check Table Sub-Location', () => {
        cy.wait('@getSubLocation').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.title().should('contain', 'Sub Locations')
        cy.get('.page-title > .d-flex > div').should('contain', 'Sub Locations')
        cy.get('@SubLocationTable').find('tbody > tr').should('have.length', 10)
        cy.get('.fw-bolder > :nth-child(3)').should('contain', 'Sub Location')
        cy.get('.fw-bolder > :nth-child(4)').should('contain', 'Location')
        cy.get('@SubLocationTable').find('[data-cy=editTable]:first').should('be.visible')
        cy.get('@SubLocationTable').find('[data-cy=deleteTable]:first').should('be.visible')
    })

    it('Check Search Sub-Location', () => {
        cy.get('input[data-cy=subLocationSearch]').type('selatan', {force: true})
        cy.intercept('GET', '**/location-sub/filter?*').as('fetchSubLocationSearch')
        // cy.wait('@fetchSubLocationSearch').its('response.statusCode').should('be.oneOf', [200, 201])

        cy.get('.table-responsive > .table').as('fetchSubLocationTableSearch')
        cy.get('@fetchSubLocationTableSearch').within(() => {
            cy.get('tbody').find('tr.align-middle').should('contain', 'Selatan')
        })
        cy.get('input[data-cy=subLocationSearch]').clear()
    })

    it('Check filter Sub Location by Location', () => {
        cy.get('[data-cy=filter] button', ).click({force: true})
        cy.get('input#column-1').should('has.value', 'location_name').check({force: true}).blur({force: true})
        cy.get('[data-cy=filterChild]').click({force: true})
        cy.get('#location_name-1').should('has.value', 'Jakarta').check({force: true}).blur({force: true})

        cy.intercept('GET', '**/location-sub/filter?*').as('fetchSubLocationFilter')
        // cy.wait('@fetchSubLocationFilter').its('response.statusCode').should('be.oneOf', [200, 201])
        // cy.get('.table-responsive > .table').as('SubLocationFilterTable')
        // cy.get('@SubLocationFilterTable').find('tbody > tr.align-middle').first().find('td').contains("Jakarta")
    })

    it('Check Sort Sub-Location by Location', () => {
        cy.get('[data-cy=sort]').find('.d-flex').contains('Sub Location').click({force: true})
        cy.intercept('GET', '**/location-sub/filter?*').as('fetchSubLocationSort')
        // cy.wait('@fetchSubLocationSort').its('response.statusCode').should('be.oneOf', [200, 201])
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

    it('Check Add Sub-Location', () => {
        cy.wait('@getSubLocation')
        cy.wait(3000)

        // check error message if sub-location filed is empty
        cy.get('.flex-wrap > :nth-child(2) > :nth-child(1) > .btn').should('contain', 'Add New Sub Location').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Sub Location')
        // cy.get('select.form-select.form-select-solid[name*="location"]').select('Choose Location').blur({force: true})
        // cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Location is required')
        cy.get('input[name*="sublocation"]').clear({force: true}).blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Sub Location is required')

        // // check input sub-location
        cy.get('.flex-wrap > :nth-child(2) > :nth-child(1) > .btn').should('contain', 'Add New Sub Location').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Sub Location')
        // cy.get('select.form-select.form-select-solid[name*="location"]').select('Bandung')
        cy.contains('Choose Location').click({ force: true })
        cy.contains('Jakarta').click({ force: true })
        cy.get('input[name*="sublocation"]').type(`Batununggal`, {force: true})
        cy.get('.modal-footer > .btn-primary').contains('Add').click({force: true}).end()
        // cy.intercept('POST', '**/location-sub*').as('addSubLocation')
        // cy.wait('@addSubLocation').its('response.statusCode').should('be.oneOf', [200, 201, 422])
    })

    it('Check Update Sub-Location', () => {
        // get location data contain 'Location Name'
        cy.get('@SubLocationTable')
        .find('tbody > tr.align-middle').filter(':contains("Antapani")')
        .find('[data-cy=editTable]:first').click({force: true})
        // check modal
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('div.modal').find('div.modal-header').should('contain', 'Edit a Sub Location')
        // edit data form
        cy.get('select.form-select.form-select-solid[name*="location"]').select('Bandung')
        cy.get('input[name*="sublocation"]').clear({force: true}).type(`Dago`, {force: true})
        cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true}).end()
        cy.intercept('PUT', '**/location-sub*').as('editSubLocation')
        // cy.wait('@editSubLocation').its('response.statusCode').should('be.oneOf', [200, 201])
    })

    it('Check Delete Sub-Location', () => {
        cy.get('@SubLocationTable')
        .find('tbody > tr.align-middle').filter(':contains("Cibenying")').first()
        .find('[data-cy=deleteTable]:first').click({force: true})
        cy.get('[role=dialog]').should('have.class', 'fade modal show')
        cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click()
        cy.intercept('DELETE', '**/location-sub/**').as('deleteSubLocation')
        // cy.wait('@deleteSubLocation').its('response.statusCode').should('be.oneOf', [200, 201])
    })

    it('Check Delete Bulk Sub-Location', () => {
        cy.get('@SubLocationTable')
        .find('tbody > tr.align-middle').filter(':contains("Jakarta")')
        .find('td.sticky-cus > .form-check > [data-cy=checkbokBulk]').check({force: true, multiple: true })
        cy.get('button[data-cy=btnBulkDelete]').should('contain', "Delete Selected").and('be.visible')
        cy.get('button[data-cy=btnBulkDelete]').click({force: true})
        cy.intercept('POST', '**/bulk-delete/location-sub*').as('deleteBulkSubLocation')
        // cy.wait('@deleteBulkSubLocation').its('response.statusCode').should('be.oneOf', [200, 201])
    })

    it('Change Number Data Per Page', () => {
        cy.get('select[name="number_of_page"]').select('25', {force: true})
        cy.intercept('GET', '**/location-sub/filter*').as('getSubLocationAllData')
        cy.wait('@getSubLocationAllData').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.get('table > tbody > tr').should('have.length.greaterThan', 10)
    })

    it('Pagination Test Page 2', () => {
        cy.get('.page-link').contains("2").click({force: true}).blur({force: true})
        cy.intercept('GET', '**/location-sub/**').as('getSubLocationPage2')
        // cy.wait('@getSubLocationPage2').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    })

})
