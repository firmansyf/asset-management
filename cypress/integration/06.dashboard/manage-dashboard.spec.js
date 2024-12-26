beforeEach(cy.login)

describe('Manage Dashboard', () => {
  beforeEach(() => {
    cy.visit('manage-dashboard')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
  })
  // it.skip('Manage Dashboard', () => {})
  // it.skip('Change Column Dashboard', () => {})
  // it.skip('Add Widget Dashboard', () => {})
  // it.skip('Remove Widget Dashboard', () => {})
  // it.skip('Add Chart Dashboard', () => {})
  // it.skip('Remove Chart Dashboard', () => {})

  it('change all charts title from Asset → Assets', () => {
    cy.get('[data-cy="card-active-carts"]').should('contain', 'Assets')
  })

  it('change Active Chart → Active Charts', () => {
    cy.get('[data-cy="card-active-carts"]').should('contain', 'Active Charts')
  })

  it('remove watermark on the background', () => {
    cy.get('[data-cy="card-widget"]:last').should('not.have.css', 'background-image', /url/i)
  })

  it('add more widgets space', () => {
    cy.get('[data-cy="widget-space"]').should('exist')
  })

  it('change button charts', () => {
    cy.get('[data-cy="btn-order-charts"]').as('btnChart')
    cy.get('@btnChart').should('contains', /reorder/i)
    cy.get('@btnChart').click({force: true})
    cy.get('@btnChart').should('contains', /add\/move/i)
  })

  it('change button widgets', () => {
    cy.get('[data-cy="btn-order-widgets"]').as('btnWidget')
    cy.get('@btnWidget').should('contains', /reorder/i)
    cy.get('@btnWidget').click({force: true})
    cy.get('@btnWidget').should('contains', /add\/move/i)
  })

  it('FE-2272 - Move Filter on Manage Dashboard', () => {
    cy.get('[data-cy="filter-container"]').should('not.have.class', 'position-top')
    cy.get('[data-cy="card-action"]').should('have.css', 'top')
  })

  it('Filter Widget', () => {
    cy.wait('@api').its('response.statusCode').should('eq', 200)
    // cy.wait(5000)
    cy.get('.css-tlfecz-indicatorContainer').click({force:true})
    cy.contains('All Dashboard').click({force:true})
  })

  it.only('BUG-150 - Save button overlap Profile option', () => {
    cy.wait('@api')
    cy.get('[data-cy="card-action"]').should('have.css', 'z-index', '1')
  })
})
