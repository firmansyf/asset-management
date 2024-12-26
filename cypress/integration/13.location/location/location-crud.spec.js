/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Location CRUD', () => {
    beforeEach( () => {
        cy.visit('location/location')
        cy.intercept('**/location/filter*').as('fetchLocations')
        cy.wait('@fetchLocations').its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table').as('LocationTable')
    })

    it('Search Location Data', () => {
        cy.get('[data-cy=locationSearch]').type('a', {force: true})
        cy.wait('@fetchLocations').its('response.statusCode').should('eq', 200)
    })
    
    it('Check Location Table (Fetch Data)', () => {
        cy.get('@LocationTable').find('tbody > tr').should('have.length', 10)
        cy.get('@LocationTable').find('[data-cy=editTable]:first').should('be.visible')
        cy.get('@LocationTable').find('[data-cy=deleteTable]:first').should('be.visible')
    })

    it('[Location] Add New Data', () => {
        cy.get('button[data-cy=addLocation]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('.btn.btn-sm.btn-primary').contains('+ Add New Location').click({force: true})
        cy.get('input[name*="location"]').type('Add Location Name', {force: true})
        cy.get('select.form-select.form-select-sm.form-select-solid[name*="location_status"]').select('Closed Down')
        cy.get('input[name="address"]').type('Address', {force: true})
        cy.get('input[name="description"]').type('Description', {force: true})
        cy.get('input[name="street"]').type('Street', {force: true})
        cy.get('input[name="city"]').type('City', {force: true})
        cy.get('input[name="state"]').type('State', {force: true})
        cy.get('input[name="postal_code"]').type('345598', {force: true})
        cy.get('input[name="latitude"]').type('-6.9213009', {force: true})
        cy.get('input[name="longitude"]').type('107.6071683', {force: true})
        cy.get('button.btn-sm.btn.btn-primary > span.indicator-label').contains('Add').click({force: true})
        cy.intercept('POST',`**/location`).as('newLocation')
    })

    it('[Location] Add New Data ( Check Notif Mandatory )', () => {
        cy.get('button[data-cy=addLocation]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('.modal-footer > .btn-primary').click({force: true})
        
        cy.get(5000)
        cy.get('.modal-footer > .btn-primary').click({force: true})
        
        cy.wait(1000)
        // if( !cy.contains('Location is required').should('not.exist') ) {
        //     cy.contains('Location is required').should('exist')
        // }
        
        if( !cy.contains('Please fill in mandatory field(s) to continue.').should('not.exist') ){
            cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
        }     
    })

    it('[Location] Edit Location Data', () => {
        cy.get('[data-cy=editTable]:first').first().click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('form').within(() => {
            cy.get('input[name*="location"]').clear().type('Add Location Name Test', {force: true})
            cy.get('select[name="location_status"]').select('Under Renovation', {force: true})
            cy.get('input[name="address"]').clear().type('Location Address', {force: true})
            cy.get('input[name="description"]').clear().type('Location Description', {force: true})
            cy.get('input[name="street"]').clear().type('Location Street', {force: true})
            cy.get('input[name="city"]').clear().type('Location City', {force: true})
            cy.get('input[name="state"]').clear().type('Location State', {force: true})
    //         cy.get('input[name="postal_code"]').clear().type('444555', {force: true})
    //         cy.get('input[name="latitude"]').clear().type('-6.9341993', {force: true})
    //         cy.get('input[name="longitude"]').clear().type('107.6048774', {force: true})
        })
        cy.get('.modal-footer > .btn-sm.btn.btn-primary > .indicator-label').contains('Save').click({force: true})
        cy.intercept('PUT',`**/location/**`, (req) => {
            req.reply({ statusCode: 200 })
        }).as('editLocation')
    })

    it('[Location] Delete Data', () => {
        cy.get('@LocationTable').within(() => {
            cy.get('tbody')
            .find('tr.align-middle').first()
            .find('[data-cy=deleteTable]').click({force: true})
        })
        cy.get('[role=dialog]').should('have.class', 'fade modal show')
        cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click()
        cy.intercept('DELETE','**/location/*').as('deleteLocation')
    })

    it('[Location] Bulk Delete', () => {
        cy.get('@LocationTable')
        .find('tbody > tr.align-middle').first()
        .find('[data-cy=checkbokBulk]').check({force: true, multiple: true })
        cy.get('button[data-cy=btnBulkDelete]').should('contain', "Delete Selected").and('be.visible')
        cy.get('button[data-cy=btnBulkDelete]').click({force: true})

        cy.get('[role=dialog]').should('have.class', 'fade modal show')
        cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click()
        // cy.intercept('POST',`**/bulk-delete/location`, (req) => {
        //     req.reply(
        //         {
        //             "message": "2 Location was deleted",
        //             "data": {
        //                 "guids": [
        //                     "c28ed828-7d61-4aa4-a9f4-9691ff8b8a82",
        //                     "07ddc7a7-55a9-49c4-aa0c-10d4a7b4d506"
        //                 ]
        //             }
        //         }
        //     )
        // }).as('deleteBulkLocation')
    })

    it('[Location] Fixed up description text on Add Location', () => {
        cy.wait('@fetchLocations')
        cy.get('button[data-cy=addLocation]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        // cy.get('.modal.show').contains('Enter the data about your location in the fields below and we will add it to your list').should('exist')
      })
})
