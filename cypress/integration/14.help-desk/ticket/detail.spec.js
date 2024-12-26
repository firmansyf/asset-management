beforeEach(cy.login)
describe('Ticket Detail', () => {
  beforeEach(() => {
    cy.visit('help-desk/ticket')
    cy.intercept('GET', '**/help-desk/ticket*').as('getTicket')
    cy.intercept('GET', '**/help-desk/ticket/**').as('getTicketDetail')
    cy.wait('@getTicket')
    cy.get('[data-cy="viewTable"]:first').click({force: true})
  })
  it('Loading Ticket', () => {
    cy.wait('@getTicketDetail')
    cy.get('[data-cy="detail-loading"]').should('exist')
  })
})
