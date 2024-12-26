beforeEach(cy.login)

describe('My Asset', () => {
  beforeEach( () => {
    cy.visit('my-assets')
    cy.intercept('GET', '**/report/asset*').as('getAsset')
    cy.wait('@getAsset')
    cy.get('[data-cy="table"]').as('myAssetTable')
  })

  it('Check My Asset Table', () => {
    cy.get('@myAssetTable').find('tbody > tr').should('have.length.greaterThan', 0)
  })
  it('Check Action Table', () => {
    cy.get('@myAssetTable').find('[data-cy=viewTable]').should('be.visible')
    cy.get('@myAssetTable').find('[data-cy=editTable]').should('be.visible')
    cy.get('@myAssetTable').find('[data-cy=deleteTable]').should('be.visible')
  })
  it('Search Asset Data', () => {
    cy.get('#kt_filter_search').type('a', {force: true})
    cy.wait('@getAsset').its('response.statusCode').should('eq', 200)
  })
  it('Sort Asset By multiple Header', () => {
    cy.get('[data-cy=sort]').click({force: true, multiple : true})
    cy.wait('@getAsset').its('response.statusCode').should('eq', 200)
  })

  it('Filter By Asset ID', () => {
    cy.get('[data-cy=filterAll]').click({force : true})
        cy.get('.colundefined').find('.form-check-custom')
        cy.get('input[type=checkbox]#column-0').check()
        cy.get('[data-cy=filterButton0]').click({force : true})
        cy.get('[data-cy=filterChild]').click({force : true})
        cy.get('div').find('input[name=asset_id]').click({multiple : true})
  })
  it('Export PDF', () => {
    cy.get('#dropdown-basic').click({force : true})
    cy.get('[data-cy=exportToPDF]').click({force: true})
    cy.get('[role=document]').should('have.class', 'modal-dialog')
      .find('.modal-content')
   cy.get('button[type="submit"]').click()
  })
  it('Export EXCEL', () => {
    cy.get('#dropdown-basic').click({force : true})
    cy.get('[data-cy=exportToExcel]').click({force: true})
    cy.get('[role=document]').should('have.class', 'modal-dialog')
      .find('.modal-content')
   cy.get('button[type="submit"]').click()
  })
  it('Change Number for Data, Testing...', () => cy.get('select[name*="number_of_page"]').select('25'))
})
