/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

describe('[ Setup Insurance Backup Approver ] Index', () => {
    beforeEach(() => {
        cy.visit('setup/insurances/backup-approver')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/backup_approver*').as('getBackup')
        cy.intercept('POST', '**/insurance_claim/backup_approver').as('addBackup')
        cy.intercept('PUT', '**/insurance_claim/backup_approver/*').as('updateBackup')
        cy.intercept('DELETE', '**/insurance_claim/backup_approver/*').as('deleteBackup')
    })

    it('Table Insurance Backup Approver', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getBackup').its('response.statusCode').should('eq', 200)
        cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    })

    it('Search Insurance Backup Approver', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getBackup').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('#search_manfucaturer').type('Phill', {force: true})
        cy.get('.table-responsive table').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Phill Collins')
        })
    })

    it('Sort Insurance Backup Approver', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getBackup').its('response.statusCode').should('eq', 200)
        cy.get('.fw-bolder > :nth-child(2)').click({force:true})
    })

    it('Pagination Insurance Backup Approver', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getBackup').its('response.statusCode').should('eq', 200)
        cy.get('.page-item.next > .page-link').click({force:true})
    })

    it('Add Insurance Backup Approver', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getBackup').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=addBackup]').click({ force:true, multiple:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('textarea[name=notes]').clear({force: true})

            cy.get('.css-tlfecz-indicatorContainer').click({force:true})
            cy.contains('testing account').click({force:true})
            cy.get(':nth-child(1) > .rdt > .form-control').click({force: true})
            cy.get(':nth-child(1) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(2) > [data-value="5"]').click({force: true})
            cy.get(':nth-child(3) > .rdt > .form-control').click({force: true})
            cy.get(':nth-child(3) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(3) > [data-value="12"]').click({force: true})
            cy.get('textarea[name=notes]').type('Testing Backup : ' + moment().format('mmss'), {force: true})
            cy.get('input[name=notif-email]').check({force:true})

            cy.get('button.btn-primary > span.indicator-label').click()
            cy.wait('@addBackup').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getBackup')
        })
    })

    it('Update Insurance Backup Approver', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getBackup').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=editTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('textarea[name=notes]').clear({force: true})

            cy.get('.css-tlfecz-indicatorContainer').click({force:true})
            cy.contains('testing account').click({force:true})
            cy.get(':nth-child(1) > .rdt > .form-control').click({force: true})
            cy.get(':nth-child(1) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(2) > [data-value="5"]').click({force: true})
            cy.get(':nth-child(3) > .rdt > .form-control').click({force: true})
            cy.get(':nth-child(3) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(3) > [data-value="12"]').click({force: true})
            cy.get('textarea[name=notes]').type('Testing Backup : ' + moment().format('mmss'), {force: true})
            cy.get('input[name=notif-email]').check({force:true})

            cy.get('button.btn-primary > span.indicator-label').click()
            cy.wait('@updateBackup').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getBackup')
        })
    })

    it('Delete Insurance Backup Approver', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getBackup').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=deleteTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
        cy.wait('@deleteBackup').its('response.statusCode').should('be.oneOf', [200, 201])
    })

    it('Detail Insurance Backup Approver', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getBackup').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=viewTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })
})
