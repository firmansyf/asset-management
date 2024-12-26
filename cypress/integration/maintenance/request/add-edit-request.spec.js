beforeEach(cy.login)

describe('Unit Test on Add & Edit Request page', () => {
    beforeEach( () => {
        cy.visit('maintenance/request')
        cy.intercept('GET', '**/maintenance/request*').as('fetchDataRequest')
        // cy.wait('@fetchDataRequest').its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table').as('TicketTable')
    })

    it('Check Add Request UI', () => {
        // check add new request button
        cy.get('[data-cy=addRequest]').should('contain', "Add New Request").click({force: true})
        // check add request title header
        cy.get('.page-title > .d-flex > div').should('contain', 'Add Request')

        // check Request Description field
        cy.get('.col-md-12 > .space-3').should('contain', 'Request Description')
        cy.get('.col-md-12 > .form-control').invoke('attr', 'placeholder').should('contain', 'Enter Request Description')

        // check Request Title field
        cy.get('.m-5 > .row > :nth-child(1) > .space-3').should('contain', 'Request Title')
        cy.get('.m-5 > .row > :nth-child(1) > .form-control').invoke('attr', 'placeholder').should('contain', 'Enter Request Title')

        // check Worker field
        cy.get('.m-5 > .row > :nth-child(2) > .space-3').should('contain', 'Worker')
        // cy.get('input#select-worker-cy').should('be.visible')
        cy.get('form > :nth-child(1) > .row > :nth-child(3)')
        // cy.get(':nth-child(2) > .input-group > [data-cy=add-input-btn]').should('be.visible')

        // check Additional Worker Title field
        cy.get('.m-5 > .row > :nth-child(3) > .space-3').should('contain', 'Additional Worker')
        cy.get('input#additional_workers').should('be.visible')
        // cy.get('.m-5 > .row > :nth-child(3) > .input-group > [data-cy=add-input-btn]').should('be.visible')

        // check Team field
        cy.get('.m-5 > .row > :nth-child(4) > .space-3').should('contain', 'Team')
        // cy.get('input#select-team-cy').should('be.visible')
        cy.get(':nth-child(4) > .col > .css-b62m3t-container > .css-n75u48-control')

        // check Due Date field
        cy.get(':nth-child(5) > .space-3').should('contain', 'Due Date')
        cy.get('.rdt > .form-control').invoke('attr', 'placeholder').should('contain', 'Input Due Date')

        // check Estimate Duration field
        cy.get(':nth-child(6) > .space-3').should('contain', 'Estimate Duration (Minutes)')
        cy.get(':nth-child(6) > .form-control').invoke('attr', 'placeholder').should('contain', 'Estimate Duration (Minutes)')

        // check Maintenance Category field
        cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .space-3').should('contain', 'Maintenance Category')
        // cy.get('input#select-category-cy').should('be.visible')
        cy.get(':nth-child(1) > .col-6 > .col > .css-b62m3t-container > .css-n75u48-control')
        // cy.get(':nth-child(1) > .input-group > [data-cy=add-input-btn]').should('be.visible')

        // check Priority field
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .space-3').should('contain', 'Priority')
          .should('be.visible')
        // cy.get('input#select-priority-cy').should('be.visible')

        // check Location field
        // cy.get(':nth-child(1) > :nth-child(3) > .space-3').contains('Location')
        cy.get('form > :nth-child(2) > :nth-child(2) > :nth-child(1)').should('be.visible')
        // cy.get('input#select-location-cy').should('be.visible')
        // cy.get(':nth-child(1) > :nth-child(3) > .input-group > [data-cy=add-input-btn]').should('be.visible')

        // check  Assets by location field
        cy.get('form > :nth-child(2) > :nth-child(2) > :nth-child(2)').should('be.visible')
        // cy.get(':nth-child(1) > :nth-child(4) > .space-3').contains('Assets by location')
        // cy.get('input#select-asset-cy').should('be.visible')
    })

    it('Check Validation for default mandatory field', () => {
        // check add new request button
        cy.get('[data-cy=addRequest]').should('contain', "Add New Request").click({force: true})
        // check add request title header
        cy.get('.page-title > .d-flex > div').should('contain', 'Add Request')

        // check Request Title field
        cy.get('.m-5 > .row > :nth-child(1) > .space-3').should('contain', 'Request Title')
        cy.get('.m-5 > .row > :nth-child(1) > .form-control').invoke('attr', 'placeholder').should('contain', 'Enter Request Title')
        cy.get('input[name*="title"]').clear({force: true}).blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'This Request Title is required')
    })


    // it('Check Add New Worker', () => {
    //     // check add new request button
    //     cy.get('[data-cy=addRequest]').should('contain', "Add New Request").click({force: true})

    //     // check add request title header
    //     cy.get('.page-title > .d-flex > div').should('contain', 'Add Request')

    //     // check Worker Title field
    //     cy.get('.m-5 > .row > :nth-child(2) > .space-3').should('contain', 'Worker')
    //     cy.get('.m-5 > .row > :nth-child(2) > .input-group > [data-cy=add-input-btn]').should('be.visible').click({force: true})

    //     // check add new user title header
    //     cy.get('.modal-title').should('contain', 'Add New User')

    //     // select role field
    //     cy.get('.select-user-cy')
    //     .click({force:true})
    //     .find('input#select-user-cy')
    //     .type('Worker{enter}', {force: true})

    //     // add first name field
    //     cy.get(':nth-child(6) > .col-3 > .col-form-label').should('contain', 'First Name')
    //     cy.get('input[name*="first_name"]').type(`Burhan`, {force: true})

    //     // add last name field
    //     cy.get(':nth-child(7) > .col-3 > .col-form-label').should('contain', 'Last Name')
    //     cy.get('input[name*="last_name"]').type(`Subroto{enter}`, {force: true})

    //     // save user
    //     // cy.get('button[data-cy=submitUser]').should('be.visible').click({force: true})
    // })


    // it('Check Add New Additional Worker', () => {
    //     // check add new request button
    //     cy.get('[data-cy=addRequest]').should('contain', "Add New Request").click({force: true})

    //     // check add request title header
    //     cy.get('.page-title > .d-flex > div').should('contain', 'Add Request')

    //     // check Additional Worker Title field
    //     cy.get('.m-5 > .row > :nth-child(3) > .space-3').should('contain', 'Additional Worker')
    //     cy.get('.m-5 > .row > :nth-child(3) > .input-group > [data-cy=add-input-btn]').should('be.visible').click({force: true})

    //     // check add new user title header
    //     cy.get('.modal-title').should('contain', 'Add New User')

    //     // select role field
    //     cy.get('.select-user-cy')
    //     .click({force:true})
    //     .find('input#select-user-cy')
    //     .type('Worker{enter}', {force: true})

    //     // add first name field
    //     cy.get(':nth-child(6) > .col-3 > .col-form-label').should('contain', 'First Name')
    //     cy.get('input[name*="first_name"]').type(`Burhanudin`, {force: true})

    //     // add last name field
    //     cy.get(':nth-child(7) > .col-3 > .col-form-label').should('contain', 'Last Name')
    //     cy.get('input[name*="last_name"]').type(`Gozali{enter}`, {force: true})

    //     // save user
    //     // cy.get('button[data-cy=submitUser]').should('be.visible').click({force: true})
    // })

    // it('Check Add New Maintenance Category', () => {
    //     // check add new request button
    //     cy.get('[data-cy=addRequest]').should('contain', "Add New Request").click({force: true})

    //     // check add request title header
    //     cy.get('.page-title > .d-flex > div').should('contain', 'Add Request')

    //     // check Maintenance Category field
    //     cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .space-3').should('contain', 'Maintenance Category')
    //     cy.get(':nth-child(1) > .input-group > [data-cy=add-input-btn]').should('be.visible').click({force: true})

    //     // check add category title header
    //     cy.get('.modal-title').should('contain', 'Add New Maintenance Category')

    //     // add maintenance category name field
    //     cy.get('label.mb-2').should('contain', 'Maintenance Category Name')
    //     cy.get('input[name*="name"]').type(`Category Request{enter}`, {force: true})

    //     // save category
    //     // cy.get('[data-cy=submitCategory]').should('contain', 'Add').click({force: true})
    //     // cy.get('.modal-footer > .btn-primary.submit-category').should('contain', 'Add').click({force: true})
    // })

    // it('Check Add New Location', () => {
    //     // check add new request button
    //     cy.get('[data-cy=addRequest]').should('contain', "Add New Request").click({force: true})

    //     // check add request title header
    //     cy.get('.page-title > .d-flex > div').should('contain', 'Add Request')

    //     // check Location field
    //     cy.get(':nth-child(1) > :nth-child(3) > .space-3').should('contain', 'Location')
    //     cy.get(':nth-child(1) > :nth-child(3) > .input-group > [data-cy=add-input-btn]').should('be.visible').click({force: true})

    //     // check add location title header
    //     cy.get('.modal-title').should('contain', 'Add a Location')

    //     // add location name field
    //     cy.get('.mb-1 > .col-form-label').should('contain', 'Location')
    //     cy.get('input[name*="location"]').eq(1).type('Location Name', {force: true})

    //     // select location status
    //     cy.get('select.form-select.form-select-sm.form-select-solid[name*="location_status"]').select('Closed Down')

    //     // save category
    //     cy.get('button[data-cy=submitLocation]').should('contain', 'Add').click({force: true})
    // })

    it('Check Add New Request', () => {
        // check add new request button
        cy.get('[data-cy=addRequest]').should('contain', "Add New Request").click({force: true})

        // check add request title header
        cy.get('.page-title > .d-flex > div').should('contain', 'Add Request')

        // check Request Description field
        cy.get('input[name="description"]').clear({force: true}).type(`Request Description`, {force: true})
        
        // check Request Title field 
        cy.get('input[name*="title"]').clear({force: true}).type('Request Title', {force: true})

        // check Worker field
        cy.get('.css-n75u48-control')
        // .click({force:true})
        cy.get('input[name=worker_guid]')
         .type('John', {force: true})

        // check Additional Worker Title field
        cy.get('form > :nth-child(1) > .row > :nth-child(3)')
        // .click({force:true})
        // .find('input#additional_workers')
        // .type('Dimas', {force: true})

        // check Team field
        cy.get('form > :nth-child(1) > .row > :nth-child(4)')
        // .click({force:true})
        // .find('input#select-team-cy')
        // .type('Testing', {force: true})

        // check Due Date field
        cy.get(':nth-child(5) > .space-3').should('contain', 'Due Date')
        // check Estimate Duration field
        cy.get(':nth-child(6) > .space-3').should('contain', 'Estimate Duration (Minutes)')
        cy.get('input[name="duration"]').clear({force: true}).type('120', {force: true})

        // check Maintenance Category field
        cy.get(':nth-child(1) > .col-6 > .col > .css-b62m3t-container > .css-n75u48-control')

        // check Priority field
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .col > .css-b62m3t-container > .css-n75u48-control')

        // check Location field
        cy.get(':nth-child(2) > :nth-child(1) > .col > .css-b62m3t-container > .css-n75u48-control')

        // check  Assets by location field
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .col > .css-b62m3t-container > .css-n75u48-control')
        // .type('Location{enter}', {force: true})

        // save category
        cy.get('button[data-cy=submitRequest]').should('contain', 'Add').click({force: true})
    })

    it.only('Add Maintenance Request ( Check Notif Mandatory )', () => {
        cy.wait('@api')
        cy.wait(3000)
        cy.get('button[type="submit"]').click({force: true})
        cy.contains('This Request Title is required').should('exist')
        cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
    })
    
    it('Check Edit Request', () => {
        cy.get(':nth-child(1) > .text-center > .d-flex > [data-cy=editTable]').click({force : true})
        // .find('tbody > tr.align-middle').filter(':contains("John")').first()
        // .find('[data-cy=editTable]:first').click({force: true})

        // check Request Description field
        cy.get('input[name="description"]').clear({force: true}).type('Request Description', {force: true})
                
        // check Request Title field
        cy.get('input[name*="title"]').clear({force: true}).type('Request Title', {force: true})

        // check Worker field
        cy.get('.css-n75u48-control')
        cy.get('input[name=worker_guid]')
         .type('Okey', {force: true})
        // .type('John{enter}', {force: true})

        // check Additional Worker Title field
        cy.get('form > :nth-child(1) > .row > :nth-child(3)')
        // .click({force:true})
        // .find('input#additional_workers')
        // .type('Dimas{enter}', {force: true})

        // check Team field
        cy.get('form > :nth-child(1) > .row > :nth-child(4)')
        // .click({force:true})
        // .find('input#select-team-cy')
        // .type('Testing{enter}', {force: true})

        // check Due Date field
        cy.get(':nth-child(5) > .space-3').should('contain', 'Due Date')

        // check Estimate Duration field
        cy.get(':nth-child(6) > .space-3').should('contain', 'Estimate Duration (Minutes)')
        cy.get('input[name="duration"]').clear({force: true}).type('120', {force: true})

        // check Maintenance Category field
        cy.get(':nth-child(1) > .col-6 > .col > .css-b62m3t-container > .css-n75u48-control')
        // .click({force:true})
        // .find('input#select-category-cy')
        // .type('Broken{enter}', {force: true})

        // check Priority field
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .col > .css-b62m3t-container > .css-n75u48-control')
        // .click({force:true})
        // .find('input#select-priority-cy')
        // .type('Medium{enter}', {force: true})

        // check Location fiel
        cy.get(':nth-child(2) > :nth-child(1) > .col > .css-b62m3t-container > .css-n75u48-control')
        // .click({force:true})
        // .find('input#select-location-cy')
        // .type('Location{enter}', {force: true})

        // check  Assets by location field
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .col > .css-b62m3t-container > .css-n75u48-control')
        // .click({force:true})
        // .find('input#select-asset-cy')
        // .type('Location{enter}', {force: true})
        // save category
        cy.get('button[data-cy=submitRequest]').should('contain', 'Save').click({force: true})
    })
})