/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('dashboard')
    cy.intercept('**/api/**').as('getWidget')
    cy.wait(5000)
  })

  it('Page Dashboard', () => {
    cy.get('[data-cy=btnLinkManageDashboard]').should('exist')
    cy.get('#filter-dashboard').should('exist')
  })

  it('Filter Widget Dashboard', () => {
    cy.get('#filter-dashboard').click({force: true})
    cy.contains('Asset Management').should('exist').click({force: true})
    cy.wait(5000)
    cy.contains('Total Assets').should('exist')
    cy.contains('Total Users').should('exist')
    cy.contains('Total Audited Assets').should('exist')
    cy.contains('Asset By Supplier').should('exist')
  })
})

describe('Feeds', () => {
  beforeEach(() => {
    cy.visit('dashboard')
    cy.intercept('**/api/v1/widget*').as('getWidget')
    cy.wait(5000)
  })
  function checkFeeds(type){
    return () => {
      if (type === 'all-update') {
        cy.get('#feedsOption').should('exist')
        cy.get('#feedsOption').select(1, {force: true})
      }else {
        cy.get('#feedsOption').should('exist')
        cy.get('#feedsOption').invoke('val', type).trigger('change', {force: true})
        cy.intercept(`**/dashboard/widget/feeds/activity_log/${type}*`).as('getFeeds')
        cy.wait('@getFeeds').its('response.statusCode').should('eq', 200)
      }
    }
  }
  it('All Updates', checkFeeds('all-update'))
  it('Asset New', checkFeeds('new-asset'))
  it('Asset Update', checkFeeds('update-asset'))
  it('Computer Update', checkFeeds('computer-update'))
  it('Inventory Update', checkFeeds('inventory-updated'))
  it('Location Update', checkFeeds('location-update'))
  it('Reservation', checkFeeds('inventory-reservation'))
  it('Setup Update', checkFeeds('setup-update'))
  it('Stock Added', checkFeeds('inventory-stock-add'))
  it('Stock Reduced', checkFeeds('inventory-stock-reduced'))
  it('User Update', checkFeeds('user-update'))
})

describe('Widget', () => {
  beforeEach(() => {
    cy.visit('dashboard')
    cy.intercept('**/api/v1/widget*').as('getWidget')
    cy.wait(3000)
  })
  it('Total Assets', () => {
    cy.contains('Total Assets').should('exist')
  })
  it('Total Users', () => {
    cy.contains('Total Users').should('exist')
  })
  it('Total Audited Assets', () => {
    cy.contains('Total Audited Assets').should('exist')
  })
  it('Total Employees', () => {
    cy.contains('Total Employees').should('exist')
  })
})

// describe('Calendar', () => {
//   beforeEach(() => {
//     cy.visit('dashboard')
//     cy.intercept('**/api/v1/widget*').as('getWidget')
//   })
//   it('Start Day From Monday', () => {
//     cy.wait('@getWidget')
//     cy.get('.fc-daygrid table thead tr th table thead tr th').first().find('a').invoke('attr', 'aria-label').should('eq', 'Monday')
//   })
// })

describe('Chart', () => {
  beforeEach(() => {
    cy.visit('dashboard')
    cy.intercept('**/api/v1/widget*').as('getWidget')
    cy.wait(3000)
  })
  it('Assets by Supplier', () => {
    cy.contains('Asset By Supplier').should('exist')
  })
  it('Asset by Status', () => {
    cy.contains('Asset By Status').should('exist')
  })
  it('Asset by Category', () => {
    cy.contains('Asset By Category').should('exist')
  })
  it('Asset Category by Location', () => {
    cy.contains('Asset Category by Location').should('exist')
  })
  it('Tickets By type', () => {
    cy.contains('Tickets By type').should('exist')
  })
  it('Unresolve Tickets by Status', () => {
    cy.contains('Unresolved Tickets by Status').should('exist')
  })
  it('Unresolved Tickets by Priority', () => {
    cy.contains('Unresolved Tickets by Priority').should('exist')
  })
  it('FE-2295 Widget Feeds, all update', () => {
    cy.wait('@getWidget')
    cy.get('.card-header > .w-auto > .fw-bolder').should('contain', 'Feeds')
    cy.get('.fs-6 > :nth-child(1) > .d-flex > .me-1').should('contain', 'Name')
    cy.get(':nth-child(2) > .d-flex > .me-1').should('contain', 'Event Name')
    cy.get(':nth-child(3) > .d-flex > .me-1').should('contain', 'Module')
    cy.get(':nth-child(4) > .d-flex > .me-1').should('contain', 'Description')
    cy.get(':nth-child(5) > .d-flex > .me-1').should('contain', 'Created At')
    cy.get(':nth-child(6) > .d-flex > .me-1').should('contain', 'Action By')
  })
})

