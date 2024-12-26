/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

describe('Team Page, Testing...', () => {
    beforeEach( () => {
        cy.visit('user-management/team')
        cy.intercept('GET', '**/api/**').as('getTeam')
        cy.intercept('POST', '**/api/**').as('addTeam')
        cy.intercept('PUT', '**/api/**').as('updateTeam')
        cy.intercept('DELETE', '**/api/**').as('deleteTeam')
        cy.intercept('POST', '**/api/**').as('bulkDeleteTeam')

        cy.wait('@getTeam')
        cy.get('.table-responsive table').as('TeamTable')
    })

    it('Check Team Table', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)
    })

    it('Check Action Table', () => {
        cy.get('@TeamTable').within(() => {
         cy.get('[data-cy=viewTable]').should('be.visible')
         cy.get('[data-cy=editTable]').should('be.visible')
         cy.get('[data-cy=deleteTable]').should('be.visible')
        }) 
    })

    it('Search Team Data', () => {
        cy.get('#kt_filter_search').type('a', {force: true})
        cy.wait('@getTeam').its('response.statusCode').should('eq', 200)
    })

    it('Sort Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)
        cy.get(':nth-child(3) > .d-flex > .me-1').click({force:true})
    })

    it.skip('Pagination Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)
        cy.get('.page-item.next > .page-link').click({force:true})
    })

    it('Add Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)
        cy.get('[data-cy=addTeam]').click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=name]').clear({force: true})
            cy.get('input[name=name]').type('Testing Team : ' + moment().format('mmss'), {force: true})

            cy.get('.css-tlfecz-indicatorContainer').click({force:true})
            cy.contains('testingaccount@mailinator.com').click({force:true})

            cy.get('.modal-footer > .btn-primary').click({force: true})
            cy.wait('@addTeam').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getTeam')
        })
    })

    it('Update Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)

        cy.get('[data-cy=editTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.get('form').within( () => {
            cy.get('input[name=name]').clear({force: true})
            cy.get('input[name=name]').type('Testing Team : ' + moment().format('mmss'), {force: true})

            cy.get('.css-tlfecz-indicatorContainer').click({force:true, multiple: true })
            cy.contains('testingaccount@mailinator.com').click({force:true})

            cy.get('.modal-footer > .btn-primary').click({force: true})
            cy.wait('@updateTeam').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.wait('@getTeam')
        })
    })

    it('Delete Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)

        cy.get('[data-cy=deleteTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
        cy.wait('@deleteTeam').its('response.statusCode').should('be.oneOf', [200, 201])
        cy.wait('@getTeam')
    })

    it('Bulk Delete Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)

        cy.get('[data-cy=checkbokBulk]').first().click({ force:true })
        cy.wait(3000)
        cy.get('[data-cy=checkbokBulk]').last().click({ force:true })

        cy.wait(3000)
        cy.get('[data-cy=bulkDeleteTeam]').click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Detail Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)

        cy.get('[data-cy=viewTable]').last().click({ force:true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal').click({force: true})
    })

    it('Export PDF Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)

        cy.get('[data-cy=actionTeam]').click({ force:true })
        cy.get('[data-cy=exportToPDF]', {delayMs: 5000}).click({ force: true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Export Excel Team', () => {
        cy.get('@TeamTable').find('tbody > tr').should('have.length.greaterThan', 0)

        cy.get('[data-cy=actionTeam]').click({ force:true })
        cy.get('[data-cy=exportToExcel]', {delayMs: 5000}).click({ force: true })
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })
})
