/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

describe('Setup Supplier', () => {
    beforeEach( () => {
        cy.visit('setup/settings/supplier')
        cy.intercept('GET', '**/setting/supplier/filter*').as('getSupplier')
        cy.intercept('POST', '**/setting/supplier').as('addSupplier')
        cy.intercept('PUT', '**/setting/supplier/*').as('updateSupplier')
        cy.intercept('DELETE', '**/setting/supplier/*').as('deleteSupplier')
        cy.intercept('POST', '**/bulk-delete/supplier').as('bulkDeleteSupplier')

        cy.wait('@getSupplier')
        cy.get('.table-responsive table').as('SupplierTable')
    })

    it('Check Supplier Table', () => {
        cy.get('@SupplierTable').find('tbody > tr').should('have.length.greaterThan', 0)
    })

    it('Check Action Table', () => {
        cy.get('@SupplierTable').find('[data-cy=viewTable]').should('be.visible')
        cy.get('@SupplierTable').find('[data-cy=editTable]').should('be.visible')
        cy.get('@SupplierTable').find('[data-cy=deleteTable]').should('be.visible')
    })

    it('Search Supplier Data', () => {
        cy.get('#kt_filter_search').type('a', {force: true})
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)
    })

    it('Sort Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)
        cy.get('.fw-bolder > :nth-child(3)').click({force:true})
    })

    it('Pagination Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)
        cy.get('.page-item.next > .page-link').click({force:true})
    })

    it('Add Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=addSupplier]').click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=name]').clear({force: true})
            cy.get('input[name=name]').type('Testing Supplier : ' + moment().format('mmss'), {force: true})

            cy.get('input[name=city]').clear({force: true})
            cy.get('input[name=city]').type('City : ' + moment().format('mmss'), {force: true})

            cy.get('input[name=street]').clear({force: true})
            cy.get('input[name=street]').type('Street : ' + moment().format('mmss'), {force: true})

            cy.get('input[name=state]').clear({force: true})
            cy.get('input[name=state]').type('State : ' + moment().format('mmss'), {force: true})

            cy.get('input[name=postcode]').clear({force: true})
            cy.get('input[name=postcode]').type(moment().format('mmss'), {force: true})

            cy.get('input[name=contact_person]').clear({force: true})
            cy.get('input[name=contact_person]').type(" Contact : " + moment().format('mmss'), {force: true})

            cy.get('input[name=contact_number]').clear({force: true})
            cy.get('input[name=contact_number]').type(moment().format('YYYYMMDDHHmmss'), {force: true})

            // cy.get('select[name=country]').select('MY', {force: true})
            cy.get('select[name=phone_code]').select('60', {force: true})

            cy.get('.modal-footer > .btn-primary').click({force: true})
            cy.wait('@addSupplier').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getSupplier')
        })
    })

    it.only('Add Supplier ( Check Notif Mandatory )', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy=addSupplier]').click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.wait(1000)
        cy.get('.modal-footer > .btn-primary').click({force: true})

        cy.wait(2000)
        cy.contains('This supplier name is required').should('exist')
    })

    it('Update Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=editTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=name]').clear({force: true})
            cy.get('input[name=name]').type('Testing Supplier : ' + moment().format('mmss'), {force: true})

            cy.get('input[name=city]').clear({force: true})
            cy.get('input[name=city]').type('City : ' + moment().format('mmss'), {force: true})

            cy.get('input[name=street]').clear({force: true})
            cy.get('input[name=street]').type('Street : ' + moment().format('mmss'), {force: true})

            cy.get('input[name=state]').clear({force: true})
            cy.get('input[name=state]').type('State : ' + moment().format('mmss'), {force: true})

            cy.get('input[name=postcode]').clear({force: true})
            cy.get('input[name=postcode]').type(moment().format('mmss'), {force: true})

            cy.get('input[name=contact_person]').clear({force: true})
            cy.get('input[name=contact_person]').type(" Contact : " + moment().format('mmss'), {force: true})

            cy.get('input[name=contact_number]').clear({force: true})
            cy.get('input[name=contact_number]').type(moment().format('YYYYMMDDHHmmss'), {force: true})

            // cy.get('select[name=country]').select('MY', {force: true})
            cy.get('select[name=phone_code]').select('60', {force: true})

            cy.get('.modal-footer > .btn-primary').click({force: true})
            cy.wait('@updateSupplier').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getSupplier')
        })
    })

    it('Delete Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=deleteTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
        cy.wait('@deleteSupplier').its('response.statusCode').should('be.oneOf', [200, 201])
        cy.wait('@getSupplier')
    })

    it('Bulk Delete Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=checkbokBulk]').first().click({ force:true })
        cy.wait(3000)
        cy.get('[data-cy=checkbokBulk]').last().click({ force:true })

        cy.wait(3000)
        cy.get('[data-cy=bulkDeleteSupplier]').click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
        cy.wait('@bulkDeleteSupplier').its('response.statusCode').should('be.oneOf', [200, 201])
        cy.wait('@getSupplier')
    })

    it('Detail Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=viewTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-sm').click({force: true})
    })

    it('Export PDF Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=actionSupplier]').click({ force:true })
        cy.get('[data-cy=exportToPDF]', {delayMs: 5000}).click({ force: true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Export Excel Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=actionSupplier]').click({ force:true })
        cy.get('[data-cy=exportToExcel]', {delayMs: 5000}).click({ force: true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Import New Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=actionSupplier]').click({ force:true })
        cy.get('[data-cy=importSupplier]', {delayMs: 5000}).click({ force: true })
    })

    it('Setup Column Supplier', () => {
        cy.wait('@getSupplier').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=actionSupplier]').click({ force:true })
        cy.get('[data-cy=setupColumnSupplier]', {delayMs: 5000}).click({ force: true })
    })
})

describe('Case By Tickets', () => {
  beforeEach( () => {
    cy.visit('setup/settings/supplier')
    cy.intercept('GET', '**/setting/supplier/filter*').as('getSupplier')
  })

  it('FE-2285 [SUPPLIER] improvement on address field', () => {
    cy.wait('@getSupplier')
    cy.get('[data-cy=addSupplier]').click({ force:true })
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.get('.modal.show').contains('Address 2').should('exist')
  })
})
