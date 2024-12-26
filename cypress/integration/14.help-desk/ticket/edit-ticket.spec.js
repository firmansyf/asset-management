/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('[Help-Desk] Edit Ticket', () => {
    beforeEach( () => {
        cy.visit('help-desk/ticket')
        cy.intercept('**/api/**').as('getContact')
    })

    it('Check Edit Ticket', () => {
        // cy.wait('@getContact')
        cy.get('.table-responsive table').as('TicketTable')
        // // check input new Ticket
        cy.get('@TicketTable').find('[data-cy=editTable]:first').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Edit Ticket')
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
})
