beforeEach(cy.login)

describe('[Location] Location Detail', () => {
    beforeEach( () => {
        cy.visit('location/location')
        cy.intercept( 'GET', '**/api/**' ).as('fetchLocationDetail')
        cy.wait('@fetchLocationDetail').its('response.statusCode').should('eq', 200)
    })
    
    
    
    it('Check Location Detail Information', () => {
        cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
        cy.get('.card-title').should('contain', 'Location Information')
        cy.get('[data-cy=generalLocation]').should('contain', 'Location')
        cy.get('[data-cy=generalLocationStatus]').should('contain', 'Location Status')
        cy.get('[data-cy=generalLocationDescription]').should('contain', 'Location Desription')
        cy.get('[data-cy=generalAddress]').should('contain', 'Address')
        cy.get('[data-cy=generalStreet]').should('contain', 'Street/Building')
        cy.get('[data-cy=generalCity]').should('contain', 'City')
        cy.get('[data-cy=generalState]').should('contain', 'State')
        cy.get('[data-cy=generalPostalCode]').should('contain', 'Zip/Postal Code')
        cy.get('[data-cy=generalCountry]').should('contain', 'Country')
    })

    it.skip('Check Location Insurance', () => {
        cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
        cy.get('[data-rb-event-key="insurance"]').click({force: true})
        cy.contains('Territory Manager')
        cy.contains('Regional Engineer')
        cy.contains('TM’s Superior 1')
        cy.contains('RE’s Superior 1')
        cy.contains('TM’s Superior 2')
        cy.contains('RE’s Superior 2')
    })

    it('Check Location Asset', () => {
        cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
        cy.get('.mb-4 > .card > .card-header').should('contain', 'Assets')
        cy.get('tbody > tr').then(($countRow) => {
            if ($countRow === 5) {
                cy.get('tbody > tr').should('have.length', 5)
                // still need to improve here to test more asset data on modal
            }
        })
    })

    it('Check Location GPS Coordinates', () => {
        cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
        cy.get(':nth-child(2) > .card > .card-header > .card-titles').should('contain', 'GPS Coordinates')
        cy.get('[style="z-index: 3; position: absolute; height: 100%; width: 100%; padding: 0px; border-width: 0px; margin: 0px; left: 0px; top: 0px; touch-action: pan-x pan-y;"]').should('be.visible')
    })

    it('Check Location Photos', () => {
        cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
        cy.get(':nth-child(3) > .card > .card-header > .card-titles').should('contain', 'Photos')
    })

    it('Check Location Print Page', () => {
        cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
        cy.get('[data-cy=printLocation]').click({force: true})
        // cy.get('.Toastify__toast-container').find('.Toastify__toast-body').should('contain', 'Location PDF successfilly generated')
    })

    it('Check Edit Location', () => {
        // need to fixed edit location component
    })

    it('Check Delete Location Detail', () => {
       cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
       cy.get('[data-cy=deleteLocation]').click({force: true})
       cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })

    it('Check Send Email', () => {
        cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
        cy.get('[data-cy=locationEmail]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('select.form-select.form-select-solid[name*="team_guid"]').select('halo', {force: true}).should('have.value', '158af3fd-b53a-4505-9288-9690ddba4e62')
        cy.get('textarea.form-control.form-control-solid.mb-2[name="other_recipient"]').type('itep@assetdata.io', {force: true})
        cy.get('textarea.form-control.form-control-solid.mb-2[name="notes"]').type('test send location message', {force: true})
        cy.get('input#include_file[name="include_file"]').check({force: true})
        cy.get('button.btn-sm.btn.btn-primary > span.indicator-label').contains('Send Email').click({force: true})
    })

})
