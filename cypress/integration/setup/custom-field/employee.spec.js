beforeEach(cy.login)
describe('Custom Field Employee List, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/custom-field/custom-field-locations')
        cy.intercept('**/api/**').as('getCfEmployee')
        cy.wait('@getCfEmployee')
    })

    it('Fetch Custom Field Employee', () => {
        cy.get('.post > #kt_content_container').find('.card-table').within(() => {
            cy.get('.card-table-header')
            cy.get('.card-body').find('.table-responsive').within(() => {
                cy.get('table > thead > tr > th').should('have.length', 6)
                cy.wait('@getCfEmployee')
            })
        })
    })

    it('Search Custom Field Employee', () => {
        cy.get('[data-cy=search]').type('email', {force: true})
        cy.wait('@getCfEmployee')
    })

    it('Sort by multiple header', () => {
        cy.get('[data-cy=sort]').click({multiple : true})
        cy.wait('@getCfEmployee')
    })

    it('Number for Data', () => {
        cy.get('[data-cy-=numberOfPage]').select('25')
        cy.wait('@getCfEmployee')
    })

    // it.skip('Pagination With Number', () => {
    //     cy.get('.page-link').contains("2").click({force: true})
    //     cy.wait('@getCfEmployee').its('response.statusCode').should('eq', 200)
    //   })

    // it('Pagination', () => {
    //     cy.get('ul.pagination > li').find('i.previous').click()
    //     cy.get('ul.pagination > li').find('i.next').click()
    // })
})

describe('Custom Field Employee CRUD, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/custom-field/custom-field-employee')
        cy.intercept('GET', '**/custom-field/*').as('getCfEmployee')
        cy.intercept('POST', '**/custom-field').as('postCfEmployee')
        cy.intercept('PUT', '**/custom-field/*').as('putCfEmployee')
        cy.intercept('DELETE', '**/custom-field/*').as('delCfEmployee')
        cy.intercept('POST', '**/bulk-delete/**').as('bulkDelCfEmployee')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)
    })

    it.only('Add New Custom Field Employee', () => {
        cy.get('[data-cy=addNewCustomField]').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('input[name*=name]').type('Testing', {force: true})
        cy.get('select[name*=datatype]').select('Text', {force: true})
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true})})
        cy.wait('@postCfEmployee').its('response.statusCode').should('be.oneOf', [200, 201, 422])
     })

    it.only('Edit Custom Field Location', () => {
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle')
        .filter(':contains("Testing")')
        .find('[data-cy=editTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('input[name*=name]').clear().type('Testing3', {force: true})
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true})})
        cy.wait('@putCfEmployee').its('response.statusCode').should('eq', 200)
     })

    it.only('View Custom Field Employee', () => {
        cy.get('[data-cy=viewTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })

    it.only('Delete Custom Field Employee', () => {
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle')
        .filter(':contains("Testing3")')
        .find('[data-cy=deleteTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true}) })
        cy.wait('@delCfEmployee').its('response.statusCode').should('eq', 200)
    })

//     it('Bulk Delete Custom Field', () => {
//         cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force : true})
//         cy.get('[data-cy=deleteBulk]').click({force : true})
//             cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true}) })
//             cy.wait('@bulkDelCfEmployee').its('response.statusCode').should('eq', 200)
//     })

})
