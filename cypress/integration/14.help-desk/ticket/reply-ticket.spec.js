beforeEach(cy.login)
describe('Ticket | Reply Ticket, Testing', () => {
    it('Reply Ticket', () => {
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

        cy.get('.col-md-8.position-relative').find('.card.border').within(() => {
            cy.get('.card-body').find('ul > li:nth-child(2) > .m-0').click({force : true})
            cy.get('[data-cy=commentReply]').click({force : true}) 
            cy.get(':nth-child(1) > .col-10 > .form-control').within(() => {
                cy.get('.react-tags__search').find('.react-tags__search-wrapper')
                cy.get('input').should('have.attr', 'placeholder', 'Enter Email').type('yusuf@assetdata.io', {force : true})
            })
            cy.get(':nth-child(2) > .col-10 > .form-control')
                cy.get('input[name=subject]').should('have.attr', 'placeholder', 'Enter Subject').type('Testing Cypress', {force : true})
            
            cy.get(':nth-child(3) > .col-10 > .form-control')
                cy.get('textarea[name=comment]').should('have.attr', 'placeholder', 'Enter Message').type('Testing', {force : true})
            
            cy.get('.mt-5 > :nth-child(3) > .btn-primary').click({force : true})
            cy.intercept('POST', `**/help-desk/ticket/**`).as('replyTicket')
        })

    })
})