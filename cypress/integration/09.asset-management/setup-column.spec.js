beforeEach(cy.login)

describe('Setup Column', () => {
  beforeEach(() => {
    cy.visit('asset-management/columns')
    cy.intercept('**/asset/setup-column').as('getColumns')
    cy.wait('@getColumns').its('response.statusCode').should('eq', 200)
  })

  it('Check Page', () => {
    cy.get('#kt_content').should('be.visible')
    cy.get('.card-label.fw-bolder.fs-3.mb-1').should('contain', 'Select Table Columns');
  })

  const list_columns = [
    'Actual Date Received', 
    'Asset Name', 
    'Assigned Employee Name', 
    'Assigned User', 
    'Audit Timestamp', 
    'Cheque/Payment Reference', 
    'Location Name',
    'Purchase Price Currency',
    'Owner Department',
    'Owner Company',
    'Manufacturer',
    'Audit Location',
    'Asset Description',
    'Asset ID',
    'Asset Status',
    'QR Code',
  ]
  it('Check List of Columns', () => {
    cy.get('#kt_content').should('be.visible')
    list_columns.forEach(e => {
      cy.get('.ms-2.user-select-none > strong').should('contain', e);
    });
  })

  it('Check Save', () => {
    cy.get('.btn-sm.btn-secondary').should('contain', 'Cancel').click({force: true})
  })

  it('Check Cancel', () => {
    cy.get('.btn-sm.btn-primary .indicator-label').should('contain', 'Save Setup').click({force: true})
  })
})
