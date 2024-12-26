beforeEach(cy.login)

describe('Table', () => {
  it('Asset', () => {
    cy.visit('asset-management/all')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Helpdesk', () => {
    cy.visit('help-desk/working-hour')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Inventory', () => {
    cy.visit('inventory')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Location', () => {
    cy.visit('location/location')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('User management', () => {
    cy.visit('user-management/users')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Report', () => {
    cy.visit('reports/asset-status')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Warranty', () => {
    cy.visit('warranty')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Maintenance', () => {
    cy.visit('maintenance/work-order')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Insurance Policy', () => {
    cy.visit('insurance/policies')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Setup', () => {
    cy.visit('setup/alert/setting')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Trash', () => {
    cy.visit('help-desk/working-hour')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })

  it('Billing', () => {
    cy.visit('billing')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })
})