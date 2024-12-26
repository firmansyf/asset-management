beforeEach(cy.superUser)
describe('Helpdesk | Canned Response ', () => {
  beforeEach(() => {
    cy.visit('help-desk/canned-response')
  })
  it('Check Canned Response Screen (Fetch Data)', () => {
    cy.get('.table-responsive table').find('tbody > tr').should('have.length.greaterThan', 0)
    cy.get('.table-responsive table').find('[data-cy=editTable]:first').should('be.visible')
    cy.get('.table-responsive table').find('[data-cy=deleteTable]:first').should('be.visible')
  })
  it('BUG-95 | All font type change', () => {
    cy.get('body').should('have.css', 'font-family').and('match', /Poppins/gi)
  })
})
