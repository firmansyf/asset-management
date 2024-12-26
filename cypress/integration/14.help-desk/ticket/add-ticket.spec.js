/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.superUser)

describe('[Help-Desk] Add Ticket', () => {
    beforeEach( () => {
        cy.visit('help-desk/ticket')
        cy.intercept('**/api/**').as('getContact')
        // cy.intercept('GET', '**/help-desk/ticket*').as('fetchTickets')
        // cy.wait('@fetchTickets').its('response.statusCode').should('eq', 200)
        // cy.get('.table-responsive table').as('TicketTable')
    })

    it.only('Check Add Ticket', () => {
        // cy.wait('@getContact')
        cy.get('.table-responsive table').as('TicketTable')
        // // check input new Ticket
        cy.get('button[data-cy=addTicket]').should('contain', "Add New Ticket").click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add Ticket')
        // cy.wait('@getContact').its('response.statusCode').should('eq', 200)
        cy.get('input[name*="name"]').type(`Ticket Name`, {force: true})

        cy.get('.select-reporter-cy')
        .click({force:true})
        .find('input#selectReporterCy')
        .type('Tes{enter}', {force: true})

        cy.get('.select-type-cy')
        .click({force:true})
        .find('input#seletTypeCy')
        .type('Question{enter}', {force: true})

        cy.get('input[name=due_time]').click({force: true})
        cy.get('[data-value="15"]').first().click({force: true})

        cy.get('.select-priority-cy')
        .click({force:true})
        .find('input#selectPriorityCy')
        .type('Medium{enter}', {force: true})

        cy.get('.select-report-channel-cy')
        .click({force:true})
        .find('input#selectReportChannelCy')
        .type('Other{enter}', {force: true})

        cy.get('input[name*="report_channel_other"]').type(`Other Report Chanel`, {force: true})
        cy.get('.fr-element > p').type(`Test text`, {force: true})

        // cy.get('.notranslate').type('Description', {force: true})
        cy.get('.modal-footer > .btn-primary').click({force: true})
    })

    it('Validation Add Ticket', () => {
        cy.wait('@getContact')
        cy.get('.table-responsive table').as('TicketTable')

        // check error message if ticket filed is empty
        cy.get('button[data-cy=addTicket]').should('contain', "Add New Ticket").click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add Ticket')
        cy.get('input[name*="name"]').clear({force: true}).blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Ticket name is required.')
        cy.get('div.modal-footer > button.btn-sm.btn.btn-secondary').should('contain', 'Cancel').click({force: true})
    })
})

describe('Case By Tickets', () => {
  beforeEach(() => {
    cy.visit('help-desk/ticket')
    cy.intercept('**/help-desk/ticket*').as('getTicket')
  })
  it('BUG-66 Blank Screen', () => {
    cy.wait('@getTicket')
    cy.get('[data-cy="addTicket"]').click({force: true})
    cy.get('.modal').invoke('show')
    cy.get('.modal.show').should('exist')
  })
})
