/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Asset Management', () => {
  beforeEach( () => {
    cy.visit('asset-management/all')
    cy.intercept('GET', '**/report/asset*').as('getAsset')
    cy.wait('@getAsset')
    cy.get('[data-cy="table"]').as('assetManagementTable')
  })

  it('Check Asset Management Table', () => {
    cy.get('@assetManagementTable').find('tbody > tr').should('have.length.greaterThan', 0)
  })

  it('Check Action Table', () => {
    cy.get('@assetManagementTable').find('[data-cy=viewTable]').should('be.visible')
    cy.get('@assetManagementTable').find('[data-cy=editTable]').should('be.visible')
    cy.get('@assetManagementTable').find('[data-cy=deleteTable]').should('be.visible')
  })

  it('Search Asset Data', () => {
    cy.get('#kt_filter_search').type('a', {force: true})
    cy.wait('@getAsset').its('response.statusCode').should('eq', 200)
  })

  it('FE-2223 | Arrangement of the search bar', () => {
    cy.get('#kt_header .container-fluid').should('have.css', 'margin-top')
    cy.get('#kt_header .container-fluid').should('have.css', 'margin-bottom')
  })

  it('Table Content is Greater Than 3 Words', () => {
    cy.wait('@getAsset')
    cy.get('@assetManagementTable').find('[data-cy=table-content]').first().should('not.contain', '...')
  })
})

describe('Asset Filter', () => {
  beforeEach( () => {
    cy.visit('asset-management/all')
    cy.intercept('GET', '**/report/asset*').as('getAsset')
  })

  it('Filter By Name', () => cy.filterBy('Asset Category', '@getAsset'))
  it('Filter By Index', () => cy.filterByIndex(2, '@getAsset'))
})

describe('Asset Sorting', () => {
  beforeEach( () => {
    cy.visit('asset-management/all')
    cy.intercept('GET', '**/report/asset*').as('getAsset')
  })

  it('Sort By Name', () => cy.sortBy('Asset Category', '@getAsset'))
  it('Sort By Index', () => cy.sortByIndex(0, '@getAsset'))
})

describe('Asset Management Export', () => {
  beforeEach(() => {
    cy.visit('asset-management/all')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    cy.intercept('GET', '**/report/asset*').as('getAsset')
  })

  it('Export PDF Asset Management', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getAsset').its('response.statusCode').should('eq', 200)

    cy.get('#dropdown-basic').click({force: true})
    cy.get('[data-cy=exportToPDF]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.wait(3000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })

  it('Export Excel Asset Management', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getAsset').its('response.statusCode').should('eq', 200)

    cy.get('#dropdown-basic').click({force: true})
    cy.get('[data-cy=exportToExcel]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.wait(3000)
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })
})

describe('[ Add Asset ] Loading Spinner Add Asset', () => {
  beforeEach(() => {
    cy.visit('asset-management/all')
    cy.intercept('**/api/**').as('api')
  })
  
  it('Display list in alphabetically order', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('#dropdown-basic').click({force: true})
    cy.get('.dropdown-menu > :nth-child(1)').should('contain', 'Availability Calendar').should('exist')
    cy.get('.dropdown-menu > :nth-child(2)').should('contain', 'Export to Excel').should('exist')
    cy.get('.dropdown-menu > :nth-child(3)').should('contain', 'Export to PDF').should('exist')
    cy.get('.dropdown-menu > :nth-child(4)').should('contain', 'Import New Assets').should('exist')
    cy.get('.dropdown-menu > :nth-child(5)').should('contain', 'Setup Column').should('exist')
  })  

  it('Loading Spinner Add Asset', () => {
    cy.wait('@api')
    cy.get('[data-cy=addAsset]').click({force:true})

    cy.wait(3000)
    if( !cy.contains('Please wait...').should('not.exist') ) {
      cy.contains('Please wait...').should('exist')
    }
  })
  
})