/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)
describe('Request Page, Testing...', () => {
    beforeEach(() => {
        cy.visit('maintenance/request')
        cy.intercept('GET', '**/maintenance/*').as('FetchRequest')
    })

    it('List Request Page', () => {
        cy.get('.table-responsive table').find('tbody > tr').should('have.length.greaterThan', 0)
    })

    it('Search Request Page', () => {
        cy.get('#kt_filter_search').type('Request1', {force : true})
        cy.wait('@FetchRequest').its('response.statusCode').should('eq', 200)
    })

    it('Filter Request', () => {
        cy.get('[data-cy=filter] button', ).click({force: true})
        cy.get('.row > :nth-child(1) > .d-flex > input[type=checkbox]').check()
        cy.get('[data-cy=filterChild]').click({force : true})
        cy.get('.rounded > .dropdown-menu > :nth-child(1) > .row > .colundefined > .form-check')
          .find('input[type=checkbox]').check()
        cy.wait('@FetchRequest').its('response.statusCode').should('eq', 200)
    })

    it('Sort Multiple Header', () => {
        cy.get('[data-cy=sort]').click({multiple : true})
    })

    it('Test Number for Data', () =>  cy.get('select[name*="country"]').select('25') )
    it('Pagination Test', () => {
        cy.get('ul.pagination > li').find('i.previous').click()
        cy.get('ul.pagination > li').find('i.next').click()
    })

    it('Form Setting, Action', () => {
        cy.get('[data-cy=actions]').click({force : true})
        cy.get('[data-cy=formSettings]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        
    })

    it('Setup Column, Action', ()=>{
        cy.wait('@FetchRequest').its('response.statusCode').should('eq', 200)

        cy.get('#dropdown-basic').click({force: true})
        cy.get('[data-cy=setupColumn]').click({force: true})

        cy.wait(5000)
        cy.get('#column-0').click({force:true})

        cy.wait(2000)
        cy.get('#column-0').click({force:true})

        cy.wait(2000)
        cy.get('.card-footer > .btn-primary').click({force:true})
    })

    it('Update Status Approve', () => {
        cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force : true})
        cy.get('[data-cy=bulkUpdateStatus]').click({force : true})
        cy.get('.modal-footer > .btn-primary').click({force : true})
        cy.intercept('POST', '**/maintenance/**').as('PostUpdateStatus')
    })

    it('Update Status Reject', () => {
        cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force : true})
        cy.get('[data-cy=bulkUpdateStatus]').click({force : true})
        cy.get('.btn-secondary').contains('Reject').click({force : true})
        cy.get('input[name=reason]').type('Test Cypress', {force: true})
        cy.get('.center > .btn-sm').click({force : true})
        cy.intercept('POST', '**/maintenance/**').as('PostUpdateStatus')
    })

    it('Loading Spinner Add Maintenace Request', () => {
        cy.wait('@FetchRequest')
        cy.get('[data-cy=addRequest]').click({ force: true })

        cy.wait(3000)
        if (!cy.contains('Please wait...').should('not.exist')) {
        cy.contains('Please wait...').should('exist')
        }
    })

    it('Setup Columns Page', () => {
        cy.get('#dropdown-basic').click({force: true})
        cy.get('.dropdown-menu > :nth-child(2)').click({force: true})
        cy.contains('Manage Columns').should('exist')
      }) 
})