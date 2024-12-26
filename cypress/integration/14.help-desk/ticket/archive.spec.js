beforeEach(cy.login)
describe('Test Ticket > Archive', () => {
    it('Flag Archive & Unarchive, Testing....', () => {
        cy.visit('help-desk/ticket')
        cy.intercept('GET', '**/help-desk/*').as('getTicket')

        cy.get('.post').find('#kt_content_container').within(() => {
            cy.get('.card-table').within(() => {
                cy.get('.card-body').find('.table-responsive').within(() => {
                    cy.get('table').within(() => {
                     cy.get('thead > tr > th') 
                      cy.get('tbody').find(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
                    })
                })
            })
        })
        cy.get('[data-cy=archiveTicket]').click({force : true})
        cy.intercept('GET', '**/help-desk/**').as('archive')
    })
})