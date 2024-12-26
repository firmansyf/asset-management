// beforeEach(() => {
//   cy.login('testingaccount@mailinator.com', 'Test@123')
// })

// describe('[ Insurance Policies ] Testing Edit Document', () => {
//   beforeEach(() => {
//     cy.visit('insurance/policies')
//     cy.intercept(
//       {
//         method: 'GET',
//         url: "**" + Cypress.env('api') + 'insurance/filter?page=1&limit=10&orderCol=name&orderDir=asc?*',
//       }
//     ).as('fetchInsurancePolicies')
//   })

//   it('[Insurance-Policies-Document ] Testing Edit Document', () => {
//     cy.wait(30000)
//     cy.get('.table-responsive table').within(() => {
//         cy.get('tbody').find('tr.align-middle').first().contains('Edit').click({force: true})
//     })

//     cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
//     cy.get('[data-rb-event-key="documents"]').click({force: true})
//     cy.get('textarea[name*="descr_document"]').type(' Update', {force: true})
//     cy.fixture('images/profile.png').then( fileContent => {
//         cy.get('input[type=file]').attachFile({
//           fileContent: fileContent.toString(),
//           fileName: 'images/profile.png',
//           encoding: 'utf-8',
//           mimeType: 'image/png'
//         })
//     })
//     cy.get('button.btn-primary > span.indicator-label').click()
//     cy.intercept('PUT',`${Cypress.env('api')}user/*`, (req) => {
//         req.reply({
//           statusCode: 200
//         })
//       }).as('editInsurancePolicies')
//   })
// })
