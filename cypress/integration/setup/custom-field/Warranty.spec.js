/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Custom Field Warranty List, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/custom-field/custom-field-warranty')
        cy.intercept('**/api/**').as('getCfWarranty')
        cy.wait('@getCfWarranty')
    })

    it('Fetch Custom Field Warranty', () => {
        cy.get('.post > #kt_content_container').find('.card-table').within(() => {
            cy.get('.card-table-header')
            cy.get('.card-body').find('.table-responsive').within(() => {
                cy.get('table > thead > tr > th').should('have.length', 6)
                cy.wait('@getCfWarranty')
            })
        })
    })

    it('Search Custom Field Warranty', () => {
        cy.get('.card-table-header').find('[data-cy=search]').type('email', {force: true})
        cy.wait('@getCfWarranty').its('response.statusCode').should('eq', 200)
    })

    it('Sort by multiple header', () => {
        cy.get('[data-cy=sort]').click({multiple : true})
        cy.wait('@getCfWarranty')
    })

    it('Number for Data', () => {
        cy.get('[data-cy-=numberOfPage]').select('25')
        cy.wait('@getCfWarranty')
    })

    // it('Pagination With Number', () => {
    //     cy.get('.page-link').contains("2").click({force: true})
    //     cy.wait('@getCfWarranty')
    // })

    // it('Pagination', () => {
    //     cy.get('ul.pagination > li').find('i.previous').click()
    //     cy.get('ul.pagination > li').find('i.next').click()
    // })
})

describe('Custom Field Location CRUD, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/custom-field/custom-field-warranty')
        cy.intercept('GET', '**/custom-field/*').as('getCfWarranty')
        cy.intercept('POST', '**/custom-field').as('postCfWarranty')
        cy.intercept('PUT', '**/custom-field/*').as('putCfWarranty')
        cy.intercept('DELETE', '**/custom-field/*').as('delCfWarranty')
        cy.intercept('POST', '**/bulk-delete/**').as('bulkDelCfWarranty')
        cy.wait(3000)
    })

    it('Add New Custom Field Warranty', () => {
        cy.get('.card-table-header').find('[data-cy=addNewCustomField]').click({force : true})
            cy.get('form').within(() => {
                cy.get('.modal-body').within(() => {
                cy.get('input[name*=name]').type('Testing', {force: true})
                cy.get('select[name*=datatype]').select('Checkbox list', {force: true})
                    cy.get('button[data-cy=addOptionList]').click({force : true})
                    cy.get('input[name*=options]').type('Check', {force: true})
                })
              cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true})})
              cy.wait('@postCfWarranty').its('response.statusCode').should('be.oneOf', [200, 201, 422])
         })
     })

    it('Edit Custom Field Location', () => {
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle')
        .filter(':contains("Testing")')
        .find('[data-cy=editTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('input[name*=name]').clear().type('Testing3', {force: true})
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true})})
        cy.wait('@putCfWarranty').its('response.statusCode').should('eq', 200)
     })

    it('View Custom Field Location', () => {
        cy.get('[data-cy=viewTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })

    it('Delete Custom Field Location', () => {
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle')
        .filter(':contains("Testing3")')
        .find('[data-cy=deleteTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true}) })
        cy.wait('@delCfWarranty')
    })

//     it('Bulk Delete Custom Field', () => {
//         cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force : true})
//         cy.get('[data-cy=deleteBulk]').click({force : true})
//             cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true}) })
//             cy.wait('@bulkDelCfWarranty')
//     })
})
