beforeEach(cy.login)

describe('Check Resolve Ticket', () => {
    beforeEach( () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/contact').as('getContact')
        cy.intercept('GET', '**/help-desk/ticket*').as('fetchTickets')
        cy.intercept('DELETE', '**/help-desk/ticket/**').as('deleteTicket')
        cy.wait('@fetchTickets').its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table').as('TicketTable')
    })

    it('Check Ticket With Status In Progress', () => {
        cy.get('.table-responsive > .table')
        .find('tbody > tr.align-middle')
        .filter(':contains("in Progress")')
        .find('td.sticky-cus > a[data-cy=viewTable]').click({force: true, multiple: true })
    })

    it('Check Resolve Ticket', () => {
        cy.get('.table-responsive > .table')
        .find('tbody > tr.align-middle')
        .filter(':contains("in Progress")')
        .find('td.sticky-cus > a[data-cy=viewTable]').click({force: true, multiple: true })
        cy.wait(35000)
        cy.get('[data-cy=resolveDropdown]').click({force: true})
        cy.get('[data-cy=resolveTicket]').click({force: true})
        cy.get('.modal-title').should('contain', "Resolve Ticket")
        cy.get('input[data-cy=issueResolved]').click({force: true})
        cy.get('button[data-cy=saveResolve]').should('contain', "Save").click({force: true})
        cy.get('.modal-title').should('contain', "Ticket Resolved")
    })
})
