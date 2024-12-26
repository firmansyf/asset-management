beforeEach(cy.login)
describe('Helpdesk | Tags', () => {
    beforeEach(() => {
        cy.visit('help-desk/tags')
        cy.intercept('GET', '**/help-desk/*').as('getTags')
    })
    it('Tags List, Testing..', () => {
        cy.get('.post').find('#kt_content_container')
          .find('.card-table').within(() => {
              cy.get('.card-table-header')
              cy.get('.card-body').within(() => {
                  cy.get('.table-responsive').within(() => {
                      cy.get('table > thead > tr > th').should('have.length', 4)
                  })
              })    
          })
          cy.wait('@getTags').its('response.statusCode').should('eq', 200)
    })

    it('Search, Testing...', () => {
        cy.get('[data-cy=search]').type('Bandung', {force: true})
        cy.intercept('GET', `**/help-desk/*`)
    })

    it('Filter, Testing...', () => {
        cy.get('[data-cy=filterAll]').click({force : true})
        cy.get('.colundefined').find('.form-check-custom')
        cy.get('input[type=checkbox]#column-0').check()
        cy.get('[data-cy=filterButton0]').click({force : true})
        cy.get('[data-cy=filterChild]').click({force : true})
        cy.get('div').find('input[name=name]').click({multiple : true})
    })

    it('Sort, Testing...', () => {
        cy.get('[data-cy=sort]').click({force : true})
        cy.wait('@getTags').its('response.statusCode').should('eq', 200)
    })

    it('Change Number for Data, Testing...', () => cy.get('select[name*="number_of_page"]').select('25'))

    it('Pagination, Testing...', () => {
        cy.get('ul.pagination > li').find('i.previous').click()
        cy.get('ul.pagination > li').find('i.next').click()
    })

    it('Action, Expot to PDF', () => {
        cy.get('[data-cy=actions]').click({force: true})
        cy.get('[data-cy=exportToPDF]').click({force : true})
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Action, Export to Excel', () => {
        cy.get('[data-cy=actions]').click({force: true})
        cy.get('[data-cy=exportToExcel]').click({force : true})
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })
})

describe('Helpdesk | Tags CRUD', () => {
    beforeEach(() => {
        cy.visit('help-desk/tags')
        cy.intercept('GET', '**/help-desk/*').as('getTags')
        cy.intercept('POST', '**/help-desk/*').as('AddTags')
        cy.intercept('PUT', '**/help-desk/*').as('EditTags')
        cy.intercept('DELETE', '**/help-desk/*').as('DeleteTags')
        cy.intercept('POST', '**/help-desk/tag/bulk-delete').as('BulkDelete')
    })

    it('Add Tag, Testing...', () => {
        cy.get('[data-cy=add]').click({force : true})
        cy.get('form').within(() => {
            cy.get('.modal-body').find('input[name=name]').type('Check Tags', {force: true})
            cy.get('.modal-footer > .btn-primary').contains('Add').click({force : true})
            cy.wait('@AddTags').its('response.statusCode').should('be.oneOf', [201, 422])
        })
    })

    it('Edit Tag, Testing...', () => {
       cy.get(':nth-child(1) > .text-center > .d-flex > [data-cy=editTable]').click({force : true})
       cy.get('form').within(() => {
            cy.get('.modal-body').find('input[name=name]').clear().type('Check', {force: true})
            cy.get('.modal-footer > .btn-primary').contains('Save').click({force : true})
        })
    })

    it('Detail Tag, Testing...', () => {
        cy.get(':nth-child(1) > [style="left: 10px;"] > [data-cy=viewTable]').click({force : true})
        cy.get('.modal-footer > .btn-sm').contains('Close').click({force : true})
    })
    
    it('Delete Tag, Testing...', () => {
       cy.get(':nth-child(1) > .text-center > .d-flex > [data-cy=deleteTable]').click({force : true})
       cy.get('.modal-footer > .btn-primary').contains('Delete').click({force : true})
    })

    it('Bulk Delete Tag, Testing...', () => {
       cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').check()
       cy.get('[data-cy=bulkDelete]').click({force : true})
       cy.get('.modal-footer > .btn-primary').click({force : true})
       cy.wait('@BulkDelete').its('response.statusCode').should('eq', 200)
    })

})