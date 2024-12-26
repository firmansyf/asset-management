// beforeEach(() => {
//   cy.login('testingaccount@mailinator.com', 'Test@123')
// })

// describe('Inventory List', () => {
//   beforeEach( () => {
//     cy.visit('inventory')
//     cy.intercept(
//       {
//         method: 'GET',
//         url: '**/inventory*',
//       },
//     ).as('fetchInventory')
//     cy.wait('@fetchInventory').its('response.statusCode').should('eq', 200)
//   })

//   it('Show Hisotry Stock - Inventory Detail', () => {
//     // cy.wait('@fetchInventory').then(() => {
//     //   cy.get('.table-responsive table').find('tbody > tr:nth-child(1) > td  a > .svg-icon').click({force: true})  
//     //   cy.get('.me-2 > #dropdown-basic').click({force: true})
//     //   cy.get('.dropdown-menu > :nth-child(2)').click({force: true})
//     // })
//   })
// })
