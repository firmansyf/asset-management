/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

describe('[ Setup Insurance Type of Peril ] Index', () => {
    beforeEach(() => {
        cy.visit('setup/insurances/type-perils')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/peril*').as('getPerils')
        cy.intercept('POST', '**/insurance_claim/peril').as('addPerils')
        cy.intercept('PUT', '**/insurance_claim/peril/*').as('updatePerils')
        cy.intercept('DELETE', '**/insurance_claim/peril/*').as('deletePerils')
    })

    it('Table Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)
        cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    })

    it('Search Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('#search_manfucaturer').type('Testing Account V1', {force: true})
        cy.get('.table-responsive table').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Testing Account V1')
        })
    })

    it('Sort Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)
        cy.get('.fw-bolder > :nth-child(2)').click({force:true})
    })

    it('Pagination Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)
        cy.get('.page-item.next > .page-link').click({force:true})
    })

    it('Add Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=addPerils]').click({ force:true, multiple:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=name]').clear({force: true})
            cy.get('input[name=deductible_amount]').clear({force: true})
            cy.get('input[name=description]').clear({force: true})

            cy.get('input[name=name]').type('Testing Perils : ' + moment().format('mmss'), {force: true})
            cy.get('input[name=deductible_amount]').type(moment().format('mmss'), {force: true})
            cy.get('input[name=description]').type('Testing Perils : ' + moment().format('mmss'), {force: true})

            cy.get('button.btn-primary > span.indicator-label').click()
            cy.wait('@addPerils').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getPerils')
        })
    })

    it('Update Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=editTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=name]').clear({force: true})
            cy.get('input[name=deductible_amount]').clear({force: true})
            cy.get('input[name=description]').clear({force: true})

            cy.get('input[name=name]').type('Testing Perils : ' + moment().format('mmss'), {force: true})
            cy.get('input[name=deductible_amount]').type(moment().format('mmss'), {force: true})
            cy.get('input[name=description]').type('Testing Perils : ' + moment().format('mmss'), {force: true})

            cy.get('button.btn-primary > span.indicator-label').click()
            cy.wait('@updatePerils').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getPerils')
        })
    })

    it('Delete Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=deleteTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
        cy.wait('@deletePerils').its('response.statusCode').should('be.oneOf', [200, 201])
    })

    it('Detail Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy=viewTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })

    it('Export PDF Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)

        cy.get('#dropdown-basic').click({force: true})
        cy.get('[data-cy=exportToPDF]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Export Excel Insurance Type of Peril', () => {
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@getPerils').its('response.statusCode').should('eq', 200)

        cy.get('#dropdown-basic').click({force: true})
        cy.get('[data-cy=exportToExcel]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })
})
