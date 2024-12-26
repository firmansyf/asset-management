// beforeEach(() => {
//     cy.login('testingaccount@mailinator.com', 'Test@123')
//   })
  
//   describe('Asset Status List', () => {
//     beforeEach( () => {
//         cy.intercept(
//             {
//             method: 'GET',
//             url: Cypress.env('api') + 'setting/status/filter?page=1&limit=10&orderDir=asc&orderCol=name',
//             },
//         ).as('fetchAssetStatus')
//         cy.visit('setup/settings/asset-status')
    
//         cy.wait(6000)
//         cy.wait('@fetchAssetStatus').its('response.statusCode').should('eq', 200)
//     })

//     it('Delete Asset Status ( Re-Assign )', () => {
//         cy.wait(6000)
//         cy.get('.table-responsive table').find('tbody tr:nth-child(1) > td').contains('Delete').click({force: true})
//         cy.get('.indicator-label').click({force: true})
//         cy.get('select.form-select.form-select-solid[name*="asset_status_guid"]').select('6bd2a77a-6d2e-4244-bdf7-473d6ddb70c7')
//         cy.get(':nth-child(18) > .modal-dialog > .modal-content > .justify-content-center > .modal-footer > .btn-primary > .indicator-label').click()
//         cy.intercept('POST',Cypress.env('api') + 'bulk-delete/asset-status').as('bulkDeleteAssetStatus')  
//     })
//   })
  