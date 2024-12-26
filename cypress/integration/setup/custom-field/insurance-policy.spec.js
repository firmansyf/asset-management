/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Custom Field Insurance Policy List, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/custom-field/custom-field-insurance')
        cy.intercept('**/api/**').as('getCfInsurancePolicy')
        cy.wait('@getCfInsurancePolicy')
    })
    it('Fetch Custom Field Insurance Policy', () => {
        cy.get('.post > #kt_content_container').find('.card-table').within(() => {
            cy.get('.card-table-header')
            cy.get('.card-body').find('.table-responsive').within(() => {
                cy.get('table > thead > tr > th').should('have.length', 6)
                cy.wait('@getCfInsurancePolicy')
            })
        })
    })

    it('Search Custom Field Insurance Policy', () => {
        cy.get('.card-table-header').find('[data-cy=search]').type('email', {force: true})
        cy.wait('@getCfInsurancePolicy').its('response.statusCode').should('eq', 200)
    })

    it('Sort by multiple header', () => {
        cy.get('[data-cy=sort]').click({multiple : true})
        cy.wait('@getCfInsurancePolicy')
    })

    it('Number for Data', () => {
        cy.get('[data-cy-=numberOfPage]').select('25')
        cy.wait('@getCfInsurancePolicy')
    })

    // it('Pagination', () => {
    //     cy.get('ul.pagination > li').find('i.previous').click()
    //     cy.get('ul.pagination > li').find('i.next').click()
    // })
})

describe('Custom Field Insurance Policy  CRUD, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/custom-field/custom-field-insurance')
        cy.intercept('GET', '**/custom-field/*').as('getCfInsurancePolicy')
        cy.intercept('POST', '**/custom-field').as('postCfInsurancePlicy')
        cy.intercept('PUT', '**/custom-field/*').as('putCfInsurancePolicy')
        cy.intercept('DELETE', '**/custom-field/*').as('delCfInsurancePolicy')
        cy.intercept('POST', '**/bulk-delete/**').as('bulkDelCfInsurancePolicy')
        cy.wait(3000)
    })

    it.only('Add New Custom Field Insurance Policy', () => {
        cy.get('[data-cy=addNewCustomField]').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('input[name*=name]').type('Testing', {force: true})
        cy.get('select[name*=datatype]').select('Text', {force: true})
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true})})
        cy.wait('@postCfInsurancePlicy').its('response.statusCode').should('be.oneOf', [200, 201, 422])
     })

    it.only('Edit Custom Field Insurance Policy', () => {
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle')
        .filter(':contains("Testing")')
        .find('[data-cy=editTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('input[name*=name]').clear().type('Testing3', {force: true})
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true})})
        cy.wait('@putCfInsurancePolicy').its('response.statusCode').should('eq', 200)
    })

    it.only('View Custom Field Insurance Policy', () => {
        cy.get('[data-cy=viewTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })

    it.only('Delete Custom Field Insurance Policy', () => {
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle')
        .filter(':contains("Testing3")')
        .find('[data-cy=deleteTable]:first').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true}) })
        cy.wait('@delCfInsurancePolicy')
    })

//     it('Bulk Delete Custom Insurance Policy', () => {
//         cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force : true})
//         cy.get('[data-cy=deleteBulk]').click({force : true})
//             cy.get('.modal-footer').within(() => { cy.get('button[type=submit]').click({force : true}) })
//             cy.wait('@bulkDelCfInsurancePolicy').
//     })

})
