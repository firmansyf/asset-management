beforeEach(cy.login)

describe('Maintenance', () => {
  beforeEach(() => {
    cy.visit('maintenance/work-order')
    cy.intercept('**/api/**').as('api')
    cy.get('[data-cy="table"]').as('maintenanceTable')
  })


  it('Check Maintenance Table', () => {
    cy.get('@maintenanceTable').find('tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Check Action Table', () => {
    cy.get('@maintenanceTable').find('[data-cy=viewTable]').should('be.visible')
    cy.get('@maintenanceTable').find('[data-cy=editTable]').should('be.visible')
    cy.get('@maintenanceTable').find('[data-cy=deleteTable]').should('be.visible')
  })

  it('Check Search Table', () => {
    cy.get('#kt_filter_search').type('a', {force: true})
  })

  it('Check Duplicate', () => {
    cy.get('.table-responsive > .table')
    .find('tbody > tr.align-middle')
    .filter(':contains("001")')
    .find('td.sticky-cus > div.form-check > input[data-cy=checkbokBulk]').check({force: true, multiple: true })
    cy.get('#dropdown-basic').click({force: true})
  })

  it('Check Status', () => {
    cy.get('.table-responsive > .table')
    .find('tbody > tr.align-middle')
    .filter(':contains("003")')
    .find('td.sticky-cus > div.form-check > input[data-cy=checkbokBulk]').check({force: true, multiple: true })
    cy.get('#dropdown-basic').click({force: true})
  })
})