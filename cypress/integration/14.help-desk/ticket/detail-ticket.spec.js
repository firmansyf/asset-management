beforeEach(cy.login)
describe('Ticket > Detail', () => {
  beforeEach(() => {
    cy.visit('help-desk/ticket')
    cy.intercept('GET', '**/help-desk/ticket*').as('getTicket')
    cy.intercept('GET', '**/help-desk/ticket/**').as('getTicketDetail')
    cy.wait('@getTicket')
    cy.get('[data-cy=viewTable]').click({force : true})
  })
  it('HD-471 [TICKET] invalid date on due time', () => {
    cy.wait('@getTicketDetail')
    cy.get('.tab-content:first').should('not.contain', 'Invalid Date')
  })
})
