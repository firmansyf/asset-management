/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

describe('[ Setup Insurance Claim Documents ] Index', () => {
    beforeEach(() => {
        cy.visit('setup/insurances/claim-document')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/document*').as('getDocument')
        cy.intercept('POST', '**/insurance_claim/document').as('addDocument')
        cy.intercept('PUT', '**/insurance_claim/document/*').as('updateDocument')
        cy.intercept('DELETE', '**/insurance_claim/document/*').as('deleteDocument')
    })

    it('Table Insurance Claim Documents', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getDocument').its('response.statusCode').should('eq', 200)
        cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    })

    it('Search Insurance Claim Documents', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getDocument').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('#search_manfucaturer').type('Test', {force: true})
        cy.get('.table-responsive table').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Testing Account V1')
        })
    })

    it('Sort Insurance Claim Documents', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getDocument').its('response.statusCode').should('eq', 200)
        cy.get('.fw-bolder > :nth-child(2)').click({force:true})
    })

    it('Pagination Insurance Claim Documents', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getDocument').its('response.statusCode').should('eq', 200)
        cy.get('.page-item.next > .page-link').click({force:true})
    })

    it('Add Insurance Claim Documents', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getDocument').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=addDocument]').click({ force:true, multiple:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=name]').clear({force: true})

            cy.get('select[name=insurance_claim_peril_guid]').select('55d3a23b-7abd-48b3-a119-db51e84601d0', {force:true})
            cy.get('input[name=name]').type('Testing Document : ' + moment().format('mmss'), {force: true})
            cy.get('input[name=is_active]').check({force: true})

            cy.get('button.btn-primary > span.indicator-label').click()
            cy.wait('@addDocument').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getDocument')
        })
    })

    it('Update Insurance Claim Documents', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getDocument').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=editTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=name]').clear({force: true})

            cy.get('select[name=insurance_claim_peril_guid]').select('55d3a23b-7abd-48b3-a119-db51e84601d0', {force:true})
            cy.get('input[name=name]').type('Testing Document : ' + moment().format('mmss'), {force: true})
            cy.get('input[name=is_active]').check({force: true})


            cy.get('button.btn-primary > span.indicator-label').click()
            cy.wait('@updateDocument').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getDocument')
        })
    })

    it('Delete Insurance Claim Documents', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getDocument').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=deleteTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
        cy.wait('@deleteDocument').its('response.statusCode').should('be.oneOf', [200, 201])
    })

    it('Detail Insurance Claim Documents', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getDocument').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=viewTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })
})
