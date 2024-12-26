/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

describe('[ Setup Settings Category ] Index', () => {
    beforeEach(() => {
        cy.visit('setup/settings/categories')
        cy.intercept('GET', '**/setting/category/filter*').as('getCategory')
        cy.intercept('POST', '**/setting/category').as('addCategory')
        cy.intercept('PUT', '**/setting/category/*').as('updateCategory')
        cy.intercept('DELETE', '**/setting/category/*').as('deleteCategory')
    })

    it('Table Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)
        cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    })

    it('Search Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('#search_category').type('test', {force: true})
        cy.get('.table-responsive table').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'test')
        })
    })

    it('Sort Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)
        cy.get('.fw-bolder > :nth-child(2)').click({force:true})
    })

    it('Pagination Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)
        cy.get('.page-item.next > .page-link').click({force:true})
    })

    it('Add Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=addCategory]').click({ force:true, multiple:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=category]').clear({force: true})
            cy.get('input[name=category]').type('Testing Category : ' + moment().format('mmss'), {force: true})

            cy.get('.modal-footer > .btn-primary').click({force: true})
            cy.wait('@addCategory').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getCategory')
        })
    })

    it('Update Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=editTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=category]').clear({force: true})
            cy.get('input[name=category]').type('Testing Category : ' + moment().format('mmss'), {force: true})

            cy.get('.modal-footer > .btn-primary').click({force: true})
            cy.wait('@updateCategory').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getCategory')
        })
    })

    it('Delete Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=deleteTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
        cy.wait('@deleteCategory').its('response.statusCode').should('be.oneOf', [200, 201])
        cy.wait('@getCategory')
    })

    it('Detail Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=viewTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-sm').click({force: true})
    })

    it('Export PDF Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)

        cy.get('#dropdown-basic').click({ force:true })
        cy.get('[data-cy=exportToPDF]', {delayMs: 5000}).click({ force: true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Export Excel Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)

        cy.get('#dropdown-basic').click({ force:true })
        cy.get('[data-cy=exportToExcel]', {delayMs: 5000}).click({ force: true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Import New Category', () => {
        cy.wait('@getCategory').its('response.statusCode').should('eq', 200)

        cy.get('#dropdown-basic').click({ force:true })
        cy.get('[data-cy=importCategory]', {delayMs: 5000}).click({ force: true })
    })

    it('Bulk Delete Category', () => {
        cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force : true})
        cy.get('[data-cy=bulkDelete]').click({force : true})
        cy.get('.modal-footer > .btn-primary').click({force : true})
        cy.intercept('POST', '**/api/**').as('BulkDelete')
    })
})

describe('Case By Tickets', () => {
  beforeEach(() => {
    cy.visit('setup/settings/categories')
    cy.intercept('GET', '**/setting/category/filter*').as('getCategory')
  })
  it("BUG-156 [CATEGORY] Delete -> List Category Can't Search when reassign", () => {
    cy.get('[data-cy="deleteTable"]:first').click({force: true})
    cy.get('.modal').invoke('show')
    cy.intercept('GET', '**/setting/category/**/check-delete', (req) => {
      req.continue((res) => {
        const {body, body :{data}} = res
        res.send({...res, body: {...body, error: true, data: {...data, can_delete: false, reason: "Are you sure you want to delete category? You have total 1 of Assets and total 1 of Types, if you want to delete it please send data assign category"}}})
      })
    }).as('checkDelete')
    // cy.get('.modal').contains('assign category').should('exist')
    // cy.get('.modal').find('button[type="submit"]:last').click({force: true})
    // cy.get('#select-reassign-category').should('exist')
  })
})
