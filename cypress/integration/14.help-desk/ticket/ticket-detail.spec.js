beforeEach(cy.login)
describe('Ticket Detail', () => {
  beforeEach(() => {
    cy.visit('help-desk/ticket')
    cy.intercept('GET', '**/help-desk/ticket*').as('getTicket')
    cy.intercept('GET', '**/help-desk/ticket/**').as('getTicketDetail')
    cy.wait('@getTicket')
    cy.get('[data-cy="viewTable"]').first().click({force: true})
    cy.wait('@getTicketDetail')
    cy.get('[data-cy="tab-general"]').click({force: true})
  })
  it('FE-2260 - Standardize Screen Detail', () => {
    cy.get('[data-cy="card-title"]').should('contain', 'Ticket Information')
    cy.get('[data-cy="ticket-card-id"]').should('exist')
  })
})
