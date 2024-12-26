/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Add Canned Response', () => {
  beforeEach(() => {
    cy.visit('help-desk/canned-response/add')
    cy.intercept('**/api/**').as('api')
  })
  afterEach(() => cy.wait(8000))

  it('Add Canned Response ( Check Notif Mandatory )', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('button[type="submit"]').click({force: true})
    cy.contains('Title is required').should('exist')
    cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
  })
})