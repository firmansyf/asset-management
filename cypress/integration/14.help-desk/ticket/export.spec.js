beforeEach(cy.login)
describe('Test Ticket > Export', () => {
   it('Export PDF', () => {
       cy.visit('help-desk/ticket')
       cy.intercept('GET', '**/help-desk/*').as('getTicket')

       cy.get('.post').find('#kt_content_container').within(() => {
           cy.get('.card-table-header').find('.d-flex').within(() => {
               cy.get('.dropdown').find('[data-cy=actions]').click({force : true})
               cy.get('[data-cy=exportToPDF]').click({force : true})
               cy.intercept('POST', '**/help-desk/**').as('getTicket')
            })
        })
        cy.get('.modal-footer > .btn-primary').click({force:true})
   })

   it('Export Excel', () => {
    cy.visit('help-desk/ticket')
    cy.intercept('GET', '**/help-desk/*').as('getTicket')

    cy.get('.post').find('#kt_content_container').within(() => {
        cy.get('.card-table-header').find('.d-flex').within(() => {
            cy.get('.dropdown').find('[data-cy=actions]').click({force : true})
            cy.get('[data-cy=exportToExcel]').click({force : true})
            cy.intercept('POST', '**/help-desk/**').as('getTicket')
        })
    })
    cy.get('.modal-footer > .btn-primary').click({force:true})
  })
})