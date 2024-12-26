beforeEach(cy.login)

describe('Case By Tickets', () => {
  beforeEach( () => {
    cy.visit('help-desk/working-hour')
    cy.intercept('GET', '**/help-desk/working_hour*').as('getWorkingHour')
    cy.intercept('PUT', '**/help-desk/working_hour/**').as('updateWorkingHour')
  })

  it("HD-359 [WORKING HOUR] edit working hour doesn't work properly", () => {
    cy.wait('@getWorkingHour')
    cy.get('[data-cy="editTable"]:last').click({force: true})
    cy.get('.modal').invoke('show')
    cy.get('.modal.show').find('button[type="submit"]').contains('Save').click({force: true})
    cy.wait('@updateWorkingHour').its('response.statusCode').should('be.oneOf', [200, 201])
  })
})
