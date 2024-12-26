/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Custom Field Asset List, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/custom-field/custom-field-assets')
        cy.intercept('**/api/**').as('getCfAssets')
        cy.wait('@getCfAssets')
    })

    it('Fetch Custom Field Asset', () => {
        cy.get('.post > #kt_content_container').find('.card-table').within(() => {
            cy.get('.card-table-header')
            cy.get('.card-body').find('.table-responsive').within(() => {
                cy.get('table > thead > tr > th').should('have.length', 7)
                cy.wait('@getCfAssets')
            })
        })
    })

    it('Search Custom Field Asset', () => {
        cy.get('[data-cy=search]').type('email', {force: true})
        cy.wait('@getCfAssets')
    })

    it('Sort by multiple header', () => {
        cy.get('[data-cy=sort]').click({multiple : true})
        cy.wait('@getCfAssets')
    })

    it('Number for Data', () => {
        cy.get('[data-cy-=numberOfPage]').select('25', {force: true})
        cy.wait('@getCfAssets')
    })

    // it.skip('Pagination With Number', () => {
    //     cy.get('.page-link').contains("2").click({force: true})
    //     cy.wait('@getCfAssets').its('response.statusCode').should('eq', 200)
    //   })

    // it('Pagination', () => {
    //     cy.get('ul.pagination > li').find('i.previous').click({force: true})
    //     cy.get('ul.pagination > li').find('i.next').click({force: true})
    //     cy.wait('@getCfAssets').its('response.statusCode').should('eq', 200)
    // })
})

describe('Custom Field Asset CRUD, Testing', () => {
    beforeEach(() => {
        cy.visit('setup/custom-field/custom-field-assets')
        cy.intercept('GET', '**/custom-field/*').as('getCfAssets')
        cy.intercept('POST', '**/custom-field').as('postCfAssets')
        cy.intercept('PUT', '**/custom-field/*').as('putCfAssets')
        cy.intercept('DELETE', '**/custom-field/*').as('delCfAssets')
        cy.intercept('POST', '**/bulk-delete/**').as('bulkDelCfAssets')
        cy.wait(2000)
    })

    it.only('Add New Custom Field Assets', () => {
        cy.get('[data-cy=addNewCustomField]').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('input[name*=name]').type('Testing', {force: true})
        cy.get('select[name*=datatype]').select('Text', {force: true})
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true})})
        cy.wait('@postCfAssets').its('response.statusCode').should('be.oneOf', [200, 201, 422])
     })

    it.only('Edit Custom Field Assets', () => {
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle')
        .filter(':contains("Testing")')
        .find('[data-cy=editTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('input[name*=name]').clear().type('Testing3', {force: true})
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true})})
        cy.wait('@putCfAssets').its('response.statusCode').should('eq', 200)
    })

    it.only('View Custom Field Assets', () => {
        cy.get('[data-cy=viewTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })

    it.only('Delete Custom Field Assets', () => {
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle')
        .filter(':contains("Testing3")')
        .find('[data-cy=deleteTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true}) })
        cy.wait('@delCfAssets').its('response.statusCode').should('eq', 200)
    })

    it('Bulk Delete Custom Field', () => {
//         cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force : true})
//         cy.get('[data-cy=deleteBulk]').click({force : true})
//         cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true}) })
//         cy.wait('@bulkDelCfAssets').its('response.statusCode').should('eq', 200)
    })
})
