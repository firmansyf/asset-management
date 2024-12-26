beforeEach(cy.login)

describe('Manufacture List, Testing..', () => {
    beforeEach(() => {
        cy.visit('setup/settings/manufacturer')
        cy.intercept('GET', '**/setting/manufacturer/*').as('getManufacturer')
    })

    it('Fetch Manufacture', () => {
       cy.get('#kt_toolbar_container > .page-title').contains('Manufacturer')
       cy.get('.card-table').find('.card-table-header')
       cy.get('.card-body')
         .within(() => {
            cy.get('.table-responsive').find('table').within(() => {
                cy.get('thead > tr > th').should('have.length', 6)
                cy.wait('@getManufacturer').its('response.statusCode').should('eq', 200)
            })
       })
    })

    it('Test Search', () => {
        cy.get('[data-cy=search]').click({force : true}).type('Metaverse', {force: true})
        cy.intercept('GET', `**/setting/manufacturer/*`)
    })

    it('Sort by Manufacturer', () => {
        cy.get(':nth-child(3) > .d-flex > .svg-icon > .mh-50px').click({force : true})
        cy.wait('@getManufacturer').its('response.statusCode').should('eq', 200)
    })

    it('Test Number for Data', () => {
        cy.get('select[name*="number_of_page"]').select('25')
    })

    it('Test Pagination', () => {
        cy.get('ul.pagination > li').find('i.previous').click()
        cy.get('ul.pagination > li').find('i.next').click()
    })
})

describe('Manufacturer Actions, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/settings/manufacturer')
        cy.intercept('GET', '**/setting/manufacturer/*').as('getManufacturer')
    })

    it('Export to PDF', () => {
        cy.get('button#dropdown-basic').click({force : true})
        cy.get('[data-cy=exportToPDF]').click({force : true})
            cy.get('.modal-content > .modal-body').contains('Are you sure want to download pdf file ?')
            cy.get('.modal-footer').find('button[type=submit]').contains('Download').click({force : true})

    })

    it('Export to Excel', () => {
        cy.get('button#dropdown-basic').click({force : true})
        cy.get('[data-cy=exportToExcel]').click({force : true})
            cy.get('.modal-content > .modal-body').contains('Are you sure want to download xlsx file ?')
            cy.get('.modal-footer').find('button[type=submit]').contains('Download').click({force : true})
    })

    it('Import New Manufacturer', () => {
        cy.get('button#dropdown-basic').click({force : true})
        cy.get('[data-cy=importNewManufacturer]').click({force : true})
    })
})

describe('Manufacturer CRUD, Testing...', () => {
    beforeEach(() => {
        cy.visit('setup/settings/manufacturer')
    })

    it('Add Manufacture', () => {
        cy.get('[data-cy=addManufacturer]').click({force : true})
        cy.get('input[name*=name]').click({force : true}).type('Anbu', {force: true})
        cy.get('input[name*=description]').click({force : true}).type('Alhamdullilah', {force: true})
        cy.get('button[type=submit]').click({force : true})
        cy.intercept('POST', '**/setting/manufacturer', { statusCode : 201})

    })

    it('Edit Manufacture', () => {
        cy.get('[data-cy=editTable]:first').click({force : true})
        cy.get('input[name*=name]').clear().click({force : true}).type('Konoha', {force: true})
        cy.get('input[name*=description]').clear().click({force : true}).type('Inc', {force: true})
        cy.get('button[type=submit]').click({force : true})
        cy.intercept('PUT', '**/setting/manufacturer/**', { statusCode : 200})

    })

    it('Delete Manufacture', () => {
        cy.get('[data-cy=deleteTable]:first').click({force : true})
        cy.get('button[type=submit]').click({force : true})
        cy.intercept('DELETE', '**/setting/manufacturer/**', { statusCode : 200})
    })

    it('Detail Manufacturer', () => {
        cy.get('[data-cy=viewTable]:first').click({force : true})
        cy.get('.modal-content').find('.modal-footer').within(() => {
            cy.get('button[type=button]').contains('Close').click({force : true})
        })
    })

    it('Bulk delete manufacture', () => {
        cy.get(':nth-child(1) > [style="left: 0px;"] > .form-check > [data-cy=checkbokBulk]').click({force : true})
        cy.get('[data-cy=bulkDelete]').click({force : true})
        cy.get('button[type=submit]').click({force : true})
        cy.intercept('POST', '**/bulk-delete/manufacturer/**', { statusCode : 200})
    })
})
