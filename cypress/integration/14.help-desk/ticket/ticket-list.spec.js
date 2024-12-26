/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('[Help-Desk] Ticket List', () => {
    beforeEach( () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/contact').as('getContact') //, {fixture: './help-desk/ticket/list/contact.json',}
        cy.intercept('GET', '**/help-desk/ticket*').as('fetchTickets') //, { fixture: './help-desk/ticket/list/index.json' }
        cy.intercept('DELETE', '**/help-desk/ticket/**').as('deleteTicket') //, {fixture: './help-desk/ticket/list/delete.json',}

        cy.wait(3000)
        cy.wait('@fetchTickets') //.its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table').as('TicketTable')
    })

    it('Check Ticket Screen (Fetch Data)', () => {
        cy.get('@TicketTable').find('tbody > tr').should('have.length.greaterThan', 0)
        cy.get('@TicketTable').find('[data-cy=editTable]:first').should('be.visible')
        cy.get('@TicketTable').find('[data-cy=deleteTable]:first').should('be.visible')
    })

    it('Check Setup Column', () => {
        cy.visit('help-desk/ticket/columns')
        cy.intercept('GET', '**/help-desk/ticket/setup-column').as('getColumn')
        cy.wait('@getColumn').its('response.statusCode').should('eq', 200)
        cy.contains('Manage Columns').should('exist')
    })

    it('Check Search Data Ticket (Keyword : TICKET-30)', () => {
        cy.get('input[data-cy=locationSearch]').type('ticket-2', {force: true})
        cy.intercept('GET', '**/help-desk/ticket?page=1*').as('searchTicket')
        // cy.wait('@searchTicket').its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table').as('TicketTableSearch')
        cy.get('@TicketTableSearch').within(() => {
            cy.get('@TicketTableSearch').find('tbody > tr > td').not('.sticky-cus').should('contain', 'TICKET-2')
        })
        cy.get('input[data-cy=locationSearch]').clear()
    })

    it('Check Add Button', () => {
        cy.get('button[data-cy=addTicket]').should('contain', "Add New Ticket").and('be.visible')
    })

    it('Check Actions Button', () => {
        cy.get('.dropdown').find('button').contains('Actions').click({force: true})
        cy.get('.dropdown-item').should('contain', "Export to PDF").and('be.visible')
    })

    it('Check Detail Button', () => {
        cy.get('@TicketTable').then(() => {
          cy.get("[data-cy=viewTable]").first().click({force: true})
        })
    })

    it('Check Sort Ticket by Ticket ID (Descending)', () => {
        cy.get('[data-cy=sort]').find('.d-flex').contains('Ticket ID').click({force: true})
        cy.intercept('GET', '**/help-desk/ticket?page=1&orderDir=desc*').as('sortTicket')
        // cy.wait('@sortTicket').its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table').find('tbody > tr > td').not('.sticky-cus').should('contain', 'TICKET-8')
    })

    it('Check Add Ticket', () => {
        // check error message if ticket filed is empty
        cy.get('button[data-cy=addTicket]').should('contain', "Add New Ticket").click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add Ticket')
        cy.get('input[name*="name"]').clear({force: true}).blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Ticket name is required.')
        cy.get('div.modal-footer > button.btn-sm.btn.btn-secondary').should('contain', 'Cancel').click({force: true})

        // check input new Ticket
        cy.wait(3000)
        cy.get('button[data-cy=addTicket]').should('contain', "Add New Ticket").click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add Ticket')
        cy.wait('@getContact').its('response.statusCode').should('eq', 200)
        cy.get('input[name*="name"]').type(`Ticket Name`, {force: true})

        cy.contains('Select Reporter').click({force : true})
        cy.get('#react-select-8-option-0').contains('jojox').click({force:true})
        cy.contains('Select Type Ticket').click({force : true})
        cy.get('#react-select-6-option-0').contains('Feature Request').click({force:true})
        cy.get('input[name=due_time]').click({force: true})
        cy.get('[data-value="15"]').first().click({force: true})
        // cy.contains('Enter Description Here').type('Description', {force: true})
        cy.get('.modal-footer > .btn-primary').click({force: true})
        // cy.wait('@addTicket').its('response.statusCode').should('be.oneOf', [200, 201, 422])

        // cy.get('div.css-b62m3t-container > div.css-n75u48-control').click({force: true, multiple: true }).type("Problem{enter}", {force: true})
        // cy.get(':nth-child(1) > :nth-child(1) > :nth-child(2) > .col > .css-b62m3t-container > .css-n75u48-control > .css-12kj9i6-ValueContainer > .css-14dclt2-Input').click({force: true }).type("Problem{enter}"), {force: true}
        // cy.get('.input-group > .col > .css-b62m3t-container > .css-n75u48-control').click({force: true, multiple:true }).type("AsepGabrug{enter}", {force: true}\)
        // cy.get(':nth-child(1) > :nth-child(3) > .col > .css-b62m3t-container > .css-n75u48-control').click({force: true }).type("Low{enter}", {force: true})
        // cy.get(':nth-child(2) > :nth-child(3) > .col > .css-b62m3t-container > .css-n75u48-control > .css-12kj9i6-ValueContainer > .css-14dclt2-Input').click({force: true }).type("Email{enter}", {force: true})
        // cy.get('input[name="email"]').type('testemail123@assetdata.io', {force: true})
        // cy.get('textarea[name="description"]').type('Description', {force: true})
        // cy.get('.modal-footer > .btn-primary').contains('Add').click({force: true})
        // cy.intercept('POST', '**/help-desk/ticket*').as('addTicket')
        // cy.wait('@addWizardLocation').its('response.statusCode').should('be.oneOf', [200, 201, 422])
    })

    it('Check Add Ticket ( Check Notif Mandatory )', () => {
        cy.get('button[data-cy=addTicket]').should('contain', "Add New Ticket").click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add Ticket')
        cy.wait(2000)
        cy.get('.modal-footer > .btn-primary').contains('Add').click({force: true})
        cy.contains('Ticket name is required').should('exist')
        cy.contains('Reporter is required').should('exist')
        cy.contains('Type ticket is required').should('exist')
        // cy.contains('Description is required').should('exist')
        cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
    })

    it('Check Edit Ticket', () => {
        // get location data contain 'Indonesia'
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle').filter(':contains("TICKET-1")').first()
        .find('[data-cy=editTable]:first').click({force: true})
        // // check modal
        // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        // cy.get('div.modal').find('div.modal-header').should('contain', 'Edit Ticket')
        // // edit data form
        // cy.wait('@getContact').its('response.statusCode').should('eq', 200)
        // cy.get('input[name*="name"]').clear({force: true}).type(`Ticket Name`, {force: true})
        // // cy.get('div.css-b62m3t-container > div.css-n75u48-control').click({force: true, multiple: true }).type("Problem{enter}", {force: true})
        // cy.get(':nth-child(1) > :nth-child(1) > :nth-child(2) > .col > .css-b62m3t-container > .css-n75u48-control > .css-12kj9i6-ValueContainer > .css-14dclt2-Input').click({force: true }).type("Problem{enter}", {force: true})
        // cy.get('.input-group > .col > .css-b62m3t-container > .css-n75u48-control').click({force: true, multiple:true }).type("AsepGabrug{enter}", {force: true})
        // cy.get(':nth-child(1) > :nth-child(3) > .col > .css-b62m3t-container > .css-n75u48-control').click({force: true }).type("Low{enter}", {force: true})
        // cy.get(':nth-child(2) > :nth-child(3) > .col > .css-b62m3t-container > .css-n75u48-control > .css-12kj9i6-ValueContainer > .css-14dclt2-Input').click({force: true }).type("Email{enter}", {force: true})
        // cy.get('input[name="email"]').clear({force: true}).type('testemail123@assetdata.io', {force: true})
        // cy.get('textarea[name="description"]').clear({force: true}).type('Description', {force: true})
        // cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true})
        // cy.intercept('PUT', '**/help-desk/ticket').as('editTicket')
        // // cy.wait('@editTicket').its('response.statusCode').should('be.oneOf', [200, 201, 422])
    })

    it('Check Delete Ticket', () => {
        cy.wait('@fetchTickets').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.get('[data-cy=deleteTable]').first().click({force: true})
        cy.wait(5000)
        cy.get('.modal-footer > .btn-primary').click({force: true})
        cy.wait('@deleteTicket').its('response.statusCode').should('be.oneOf', [200, 201])
        cy.wait('@fetchTickets')
    })

    it('Check Delete Bulk Ticket', () => {
        cy.get('.table-responsive > .table')
        .find('tbody > tr.align-middle')
        .filter(':contains("Tes 10")')
        .find('td.sticky-cus > div.form-check > input[data-cy=checkbokBulk]').check({force: true, multiple: true })
        cy.get('button[data-cy=bulkDelete]').should('contain', "Delete Selected").and('be.visible')
        cy.get('button[data-cy=bulkDelete]').click({force: true})
        cy.intercept('POST', '**/bulk-delete/ticket*').as('deleteBulkTicket')
        // cy.wait('@deleteBulkCompany').its('response.statusCode').should('be.oneOf', [200, 201])
      })

    it('Change Number Data Per Page', () => {
        cy.get('select[name="number_of_page"]').select('25', {force: true})
        cy.intercept('GET', '**/help-desk/ticket*')
        cy.get('@TicketTable').find('tbody > tr').then(($row) => {
            if ($row > 10) {
                cy.get('@TicketTable').find('thead > tr > th').should('contain', "Ticket Name").and('be.visible')
            }
        })
    })

    it('Pagination Test go to Page 2', () => {
        // cy.get('.page-link').contains("2").click({force: true})
        // cy.intercept('GET', '**/help-desk/ticket?page=2&limit=10&orderDir=asc&orderCol=name')
        // cy.get('@TicketTable').find('thead > tr > th').should('contain', "Ticket Name").and('be.visible')
    })
    it('HD-527 Add tags on Add/Edit Ticket', () => {
      cy.get('[data-cy="addTicket"]').click({force: true})
      cy.get('label[for="tags"]').next().find('[data-cy="add-input-btn"]').should('exist')
    })
})
