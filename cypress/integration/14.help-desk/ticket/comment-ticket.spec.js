beforeEach(cy.login)
describe('Ticket | Comment Ticket, Testing', () => {
    it('Comment Ticket', () => {
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
       
        cy.get('.card-body').find('ul > li:nth-child(2) > .m-0').click({force : true})
        cy.get('textarea[name=comment]').should('have.attr', 'placeholder', 'Enter Comment').type('Test Comment', {force : true})
        cy.get('.card-body > .row > .col-12 > .btn-primary').click({force : true})
        cy.intercept('POST', `**/help-desk/ticket/**`).as('commentTicket')
    })
})