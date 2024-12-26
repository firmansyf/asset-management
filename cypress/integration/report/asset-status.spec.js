/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)
describe('Report Asset Status, Testing...', () => {
  beforeEach( () => { 
    cy.visit('reports/asset-status')
    cy.intercept(`**/report/*`).as('getAssetStatus')
  })
    it('Fetch Report Asset Status', () => {
        cy.get('#kt_content').find('.card-body')
        cy.get('.table-responsive table')
          .find('thead > tr > th')
          .should('have.length', 5)
        cy.wait('@getAssetStatus').its('response.statusCode').should('eq', 200)
    })

    it('Search Asset Status', () => {
        cy.get('input[data-test=search]').should('have.attr', 'placeholder', 'Search')
          .click({force: true})    
          .type('yusuf', {force: true})
        cy.wait('@getAssetStatus').its('response.statusCode').should('eq', 200)
    })

    it('Test Button Actions', () => {
      cy.get('.dropdown').find('button[type="button"]').should('have.class', 'dropdown-toggle').click({force: true})
    })
    
    it('Test Button Actions Export To PDF', () => {
      cy.get('.dropdown').find('button[type="button"]')
        .should('have.class', 'dropdown-toggle')
        .click({force: true})
      cy.wait(3000)
      cy.get('div').should('have.class', 'show')
        .find('a')
        .contains('Export to PDF')
        .click({force: true})
      cy.get('[role=document]').should('have.class', 'modal-dialog')
        .find('.modal-content')
      cy.get('button[type="submit"]').click()
    })

    it('Test Button Actions Export To Excel', () => {
      cy.get('.dropdown').find('button[type="button"]')
        .should('have.class', 'dropdown-toggle')
        .click({force: true})
      cy.get('div').should('have.class', 'show')
        .find('a')
        .contains('Export to Excel')
        .click({force: true})
      cy.get('[role=document]').should('have.class', 'modal-dialog')
        .find('.modal-content')
      cy.get('button[type="submit"]').click()

    })

    it('Test Button Actions Automated Report', () => {
      cy.get('.dropdown').find('button[type="button"]')
        .should('have.class', 'dropdown-toggle')
        .click({force: true})
      cy.get('div').should('have.class', 'show')
        .find('a.dropdown-item')
        .contains('Automated Report')
        .click({force: true})
      cy.get('form').within(() => {
        cy.get('.modal-header').find('div').should('have.class', 'modal-title').contains('Add Automated Report')
        cy.get('.modal-body').within(() => {
          cy.get('.report-name').find('input[name*="name"]').should('have.value', 'Asset Status')
          cy.get('.report-team').find('select[name*="team_guid"]').select('testing (1)')
          cy.get('.report-frequency').within(() => {
            cy.get('input[name*="frequency_value"]').click({multiple: true})
          })
        })
        cy.get('.modal-footer').find('button[type=submit]').contains('Add').click()
      })
      cy.intercept('POST', '**/automation-report', {statusCode : 200})

    })

    it('Test Sort by Multiple Data', () => {
      cy.get('[data-cy=sort]').click({multiple : true})
      cy.wait('@getAssetStatus').its('response.statusCode').should('eq', 200)
  
    })

    it('Test Number for Data',() => {
      cy.get('select[name*="number_of_page"]').select('25')
    })


    it('Test Pagination', () => {
      cy.get('ul.pagination > li').find('i.previous').click()
      cy.get('ul.pagination > li').find('i.next').click()
    })


})